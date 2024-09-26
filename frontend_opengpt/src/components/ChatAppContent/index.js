import {Avatar, List, Skeleton} from "antd";
import user from "../../assets/avatars/user.png";
import bot from "../../assets/avatars/bot.png";
import React from "react";

const ChatAppContent = function ({messages, theme}) {

    const convertToOrderedList = (text) => {
        // 移除所有 **text** 中的 ** 并保留文字
        const cleanedText = text.replace(/\*\*(.*?)\*\*/g, '$1');

        // 定义正则表达式来匹配 1. 2. 3. 或 1） 2） 3） 或 （1） （2）
        const listRegex = /(?:\d+\.|\d+\)|\（\d+\）)\s?([^0-9]+)/g;

        // 匹配代码块，寻找 ```language content ```
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

        // 用来存储普通文本段落、列表项和代码块
        let parts = [];
        let lastIndex = 0;
        let match;
        let orderedListItems = [];

        // 先处理代码块，捕获它们并转换为 <pre><code></code></pre>
        const segments = [];
        let codeLastIndex = 0;

        while ((match = codeBlockRegex.exec(cleanedText)) !== null) {
            // 添加代码块之前的文本部分
            if (match.index > codeLastIndex) {
                segments.push(cleanedText.slice(codeLastIndex, match.index));
            }
            // 添加代码块的 JSX 结构
            segments.push(
                <pre key={match.index}>
                <code className={match[1]}>{match[2]}</code>
            </pre>
            );
            codeLastIndex = codeBlockRegex.lastIndex;
        }

        // 添加最后的文本部分（如果代码块不是最后一部分）
        if (codeLastIndex < cleanedText.length) {
            segments.push(cleanedText.slice(codeLastIndex));
        }

        // 对每个文本段进行进一步处理，包括将列表转换为 JSX
        const finalSegments = segments.map((segment, index) => {
            if (typeof segment !== 'string') return segment; // 跳过已经是 JSX 的部分（例如代码块）

            // 对每个文本段应用列表的正则匹配
            let match;
            lastIndex = 0;
            orderedListItems = [];
            let resultParts = [];

            while ((match = listRegex.exec(segment)) !== null) {
                // 提取编号前的普通文本部分
                if (match.index > lastIndex) {
                    resultParts.push(segment.slice(lastIndex, match.index));
                }
                // 将匹配的列表项内容添加到有序列表项数组中
                orderedListItems.push(match[1].trim());
                lastIndex = listRegex.lastIndex;
            }

            // 捕获最后一段非列表的普通文本
            if (lastIndex < segment.length) {
                resultParts.push(segment.slice(lastIndex));
            }

            // 如果找到了列表项，将普通文本和列表项组合成 JSX 结构
            if (orderedListItems.length > 0) {
                return (
                    <div key={index}>
                        {resultParts[0]}
                        <ol>
                            {orderedListItems.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ol>
                        {resultParts.length > 1 && resultParts[1]}
                    </div>
                );
            }

            // 如果没有列表项，返回普通的文本段落
            return <div key={index}>{segment}</div>;
        });

        // 返回最终的 JSX 结构
        return <div>{finalSegments}</div>;
    }



    const darkChatAppContent = () => {
        return (
            <List
                bordered
                dataSource={messages}
                renderItem={(item) => (
                    <List.Item className={item.type === 'user' ? 'user-message-dark' : 'bot-message-dark'}>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={item.type === 'user' ? user : bot}/>}
                                title={<div style={{
                                    color: '#fff',
                                    marginTop: '6px',
                                    wordWrap: 'break-word',
                                    maxWidth: '100%'
                                }}>{convertToOrderedList(item.text)}</div>}
                            />
                        </Skeleton>
                    </List.Item>
                )}
                style={{maxHeight: '70vh', overflowY: 'auto'}}
            />
        )
    }

    const lightChatAppContent = () => {
        return (
            <List
                bordered
                dataSource={messages}
                renderItem={(item) => (
                    <List.Item className={item.type === 'user' ? 'user-message-light' : 'bot-message-light'}>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={item.type === 'user' ? user : bot}/>}
                                title={<div style={{
                                    color: '#333',
                                    marginTop: '6px',
                                    wordWrap: 'break-word',
                                    maxWidth: '100%'
                                }}>{convertToOrderedList(item.text)}</div>}
                            />
                        </Skeleton>
                    </List.Item>
                )}
                style={{maxHeight: '70vh', overflowY: 'auto'}}
            />
        )
    }

    return (
        <div>
            {messages.length > 0 && (
                (theme === 'dark' ? darkChatAppContent() : lightChatAppContent())
            )}
        </div>
    )
}

export default ChatAppContent;