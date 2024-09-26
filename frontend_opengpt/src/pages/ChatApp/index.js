import React, { useState, useEffect } from 'react';
import {Layout, Input, List, Button, Menu, Skeleton, Avatar, Switch} from 'antd';
import { ArrowUpOutlined, PlusCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { restfulRequest } from '../../utils/index';
import bot from '../../assets/avatars/bot.png'
import user from '../../assets/avatars/user.png'
import './ChatApp.css';
import ChatAppSider from "../../components/ChatAppSider";
import ChatAppContent from "../../components/ChatAppContent";

const { TextArea } = Input;
const { Header, Content, Footer, Sider } = Layout;

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]); // Ensure sessions is initialized as an array
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0); // Track current session
    const [abortController, setAbortController] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Load sessions from localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions')) || [];
        setSessions(savedSessions);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNewSession = () => {
        // Abort any ongoing request before creating a new session
        if (abortController) {
            abortController.abort();
        }
        const newSession = { messages: [] };
        const updatedSessions = [...sessions, newSession];
        setSessions(updatedSessions);
        setMessages([]); // Clear messages for the new session
        setCurrentSessionIndex(updatedSessions.length - 1); // Set current session to new session
        setInputValue('');
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    const handleSend = async () => {
        if (inputValue) {
            // Create a new message array including the user's message
            const newMessages = [...messages, { text: inputValue, type: 'user' }];
            setMessages(newMessages); // Update state with user message
            setInputValue(''); // Clear input

            // Add a loading message for the bot
            const loadingMessage = { text: "", type: 'bot', loading: true }; // Include loading state
            const updatedMessages = [...newMessages, loadingMessage];
            setMessages(updatedMessages); // Update state with loading message

            setLoading(true); // Set loading to true

            try {
                const controller = new AbortController(); // Create a new abort controller for this request
                setAbortController(controller); // Set it in state

                const response = await restfulRequest(inputValue, newMessages.map(msg => msg.text), { signal: controller.signal });
                const botMessage = response.data.response || "没有响应"; // Based on actual response structure

                // Update messages to replace the loading message with the actual response
                const finalMessages = updatedMessages.map(msg =>
                    msg.loading ? { text: botMessage, type: 'bot' } : msg
                );

                setMessages(finalMessages); // Update state with the final messages

                // Save to current session
                const updatedSessions = [...sessions];
                updatedSessions[currentSessionIndex] = { ...updatedSessions[currentSessionIndex], messages: finalMessages };
                setSessions(updatedSessions);
                localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Request aborted'); // Handle aborted request if necessary
                } else {
                    console.error("Error calling API:", error);
                    // Handle error by updating the last message
                    const errorMessages = [...newMessages, { text: "Error: Unable to get a response.", type: 'bot' }];
                    setMessages(errorMessages);
                }
            } finally {
                setLoading(false); // Set loading to false regardless of the outcome
            }
        }
    };

    const changeTheme = () => {
        if(theme === "dark") setTheme("light")
        else setTheme("dark");
    }

    const switchSession = (index) => {
        setCurrentSessionIndex(index);
        setMessages(sessions[index]?.messages || []); // Load messages from the selected session
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <ChatAppSider sessions={sessions} switchSession={switchSession} handleNewSession={handleNewSession} isMobile={isMobile} theme={theme} changeTheme={changeTheme}></ChatAppSider>
            <Layout>
                <Header style={{textAlign: 'center'}} className={theme === "dark" ? "dark-theme" : "light-theme"}>
                    华新-组合大语言模型
                    <Switch
                        checked={theme === 'light'}
                        onChange={changeTheme}
                        checkedChildren="浅色"
                        unCheckedChildren="深色"
                        className={"changeThemeButton"}
                    />
                </Header>
                <Layout
                    className={theme === "dark" ? "dark-theme" : "light-theme"}
                    style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <ChatAppContent messages={messages} theme={theme}></ChatAppContent>
                    <div style={{
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        marginTop: '10px',
                        paddingBottom: '40px',
                        position: 'relative'
                    }}>
                        <TextArea
                            placeholder="输入消息"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleEnter} // Listen for Enter keys
                            className={`${isMobile ? 'mobile-textarea' : 'desktop-textarea'} ${theme === "dark" ? "dark-theme" : "light-theme"}`}
                        />
                        <div
                            className={isMobile ? 'mobile-input' : 'desktop-input'}>
                            {
                                !isMobile && (
                                    <span className={theme === "dark" ? "dark-theme" : "light-theme"} style={{marginRight: '4px', marginBottom: '7px'}}>Enter发送/Shift+Enter换行</span>
                                )
                            }
                            <Button
                                type="primary"
                                icon={<ArrowUpOutlined/>}
                                onClick={handleSend}
                                loading={loading}
                                className={theme === "dark" ? "dark-theme" : "light-theme"}
                                style={{border: "1px solid #f3f3f3"}}
                            />
                        </div>
                    </div>
                </Layout>
                <Footer style={{textAlign: 'center',}} className={`${isMobile ? 'sider-hidden' : ''} ${theme === "dark" ? "dark-theme" : "light-theme"}`} >
                    HX_Gold可能会犯错误。请考虑核实重要信息。
                </Footer>
            </Layout>
        </Layout>
    );
};

export default ChatApp;
