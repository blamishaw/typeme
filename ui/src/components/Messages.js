import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import Message from './Message';

const Messages = () => {
    const { serverMessage } = useContext(WebSocketContext);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (typeof serverMessage.type === 'string') {
            if (serverMessage.type === 'MESSAGE') {
                setMessages(prevMessages => [...prevMessages, serverMessage.message]);
            }
        }
    }, [serverMessage])

    return (
        <div>
            {messages.map((message, idx) => 
                <Message key={idx} from={message.from} content={message.content}/>)}
        </div>
    );
}

export default Messages;