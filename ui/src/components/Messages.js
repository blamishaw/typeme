import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import Message from './Message';

const Messages = () => {
    const { displayName, serverMessage } = useContext(WebSocketContext);

    // TODO: Refactor color logic into a custom hook
    const [messages, setMessages] = useState([]);
    const [colorMap, setColorMap] = useState({});
    const [idx, setIdx] = useState(1);

    useEffect(() => {
        if (typeof serverMessage.type === 'string') {
            if (serverMessage.type === 'MESSAGE') {
                const from = serverMessage.message.from
                if (from !== displayName && !Object.keys(colorMap).includes(from)) {
                    setColorMap((prevColorMap) => ({...prevColorMap, [from]: idx}));
                    setIdx((idx+1 > 6) ? 1 : idx+1);
                }
                setMessages(prevMessages => [...prevMessages, serverMessage.message]);
            }
            if (serverMessage.type === 'USER_CTX_MSG') {
                console.log("received ctx message");
                setMessages(prevMessages => [...prevMessages, serverMessage.message]);
            }
        }
    }, [serverMessage])

    let messagesEnd = undefined;
    useEffect(() => {
      // Scrolls to end of messages as they are added to the chat
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }, [ messages ])

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