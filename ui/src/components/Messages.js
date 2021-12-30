import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const Messages = () => {
    const { serverMessage } = useContext(WebSocketContext);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (typeof serverMessage.type === 'string') {
            if (serverMessage.type === 'MESSAGE') {
                setMessages([...messages, serverMessage.message]);
            }
        }
    }, [serverMessage])

    return (
        <div>
            {messages.map((message, idx) => 
                <p key={idx}>From: {message.from} -- Content: {message.content}</p>)}
        </div>
    );
}

export default Messages;