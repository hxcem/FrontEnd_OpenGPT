import {Layout, Input, List, Button, Menu, Skeleton, Avatar, Switch} from 'antd';
import {HistoryOutlined, PlusCircleOutlined} from "@ant-design/icons";
import React from "react";
import "./ChatAppSider.css";

const {Sider } = Layout;

const ChatAppSider = ({sessions, switchSession, handleNewSession, isMobile, theme, changeTheme}) => {
    const [collapsed, setCollapsed] = React.useState(false);

    return(
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className={isMobile ? 'sider-hidden' : ''} style={{ color: '#fff', backgroundColor: '#1E1E1E' }}>
            {
                theme === 'light' &&
                <Menu mode="inline" style={{height: '100%', borderRight: 0}} theme={"light"} defaultOpenKeys={['session history']}>
                    <Menu.Item key="newSession" onClick={handleNewSession} style={{}} icon={<PlusCircleOutlined/>}>
                        新会话
                    </Menu.Item>
                    <Menu.SubMenu key="session history" title="历史会话" style={{}} icon={<HistoryOutlined/>}>
                        {sessions.map((session, index) => (
                            <Menu.Item key={`session-${index}`} onClick={() => switchSession(index)} style={{}}>
                                {session.messages && session.messages.length > 0
                                    ? session.messages[0].text.slice(0, 10) + '...' // Display first 10 characters of the first message
                                    : '空会话'}
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                </Menu>

            }
            {
                theme === "dark" &&
                <Menu mode="inline" style={{ color: '#fff', height: '100%', borderRight: 0, backgroundColor: '#1E1E1E' }} theme={"dark"} defaultOpenKeys={['session history']}>
                    <Menu.Item key="newSession" onClick={handleNewSession} style={{ color: '#fff' }} icon={<PlusCircleOutlined/>}>
                        新会话
                    </Menu.Item>
                    <Menu.SubMenu key="session history" title="历史会话" style={{ color: '#fff' }} icon={<HistoryOutlined/>}>
                        {sessions.map((session, index) => (
                            <Menu.Item key={`session-${index}`} onClick={() => switchSession(index)} style={{ color: '#fff' }}>
                                {session.messages && session.messages.length > 0
                                    ? session.messages[0].text.slice(0, 10) + '...' // Display first 10 characters of the first message
                                    : '空会话'}
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                </Menu>
            }
        </Sider>
    )
}

export default ChatAppSider;