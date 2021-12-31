import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import Message from './Message';

const Messages = () => {
    const { serverMessage } = useContext(WebSocketContext);

    const [messages, setMessages] = useState([]);
    const [colorMap, setColorMap] = useState({});
    let idx = 1;

    useEffect(() => {
        if (typeof serverMessage.type === 'string') {
            if (serverMessage.type === 'MESSAGE') {
                // TODO: Fix
                const from = serverMessage.message.from
                if (!Object.keys(colorMap).includes(from)) {
                    setColorMap((prevColorMap) => ({...prevColorMap, [from]: idx}));
                    idx = (idx+1 > 6) ? 0 : idx+1;
                }
                setMessages(prevMessages => [...prevMessages, serverMessage.message]);
            }
        }
    }, [serverMessage])

    let messagesEnd = undefined;
    useEffect(() => {
      // Scrolls to end of messages as they are added to the chat
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }, [ messages ])

    console.log(colorMap);
    return (
        <div className="messages-container messages-wrapper">
            <div className="messages">
            {messages.map((message, idx) => 
                <Message key={idx} from={message.from} content={message.content} colorId={colorMap[message.from]}/>)}
            </div>
            <div ref={(el) => messagesEnd = el}/>
        </div>
    );
}

export default Messages;