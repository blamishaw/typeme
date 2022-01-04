import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { processServerMessage } from '../network/connect';
import Message from './Message';

const NUM_MESSAGE_COLORS = 6;

const Messages = () => {
    const { displayName, serverMessage } = useContext(WebSocketContext);

    // Currently, I store messages in the client
    // The implications of this are that:
    //  a. Users will maintain a different set/ordering of messages
    //  b. On refresh or renavigation to the app, all earlier messages are lost
    // Ultimately, I would like to store messages in a db
    const [messages, setMessages] = useState([]);
    const [colorMap, setColorMap] = useState({});
    const [idx, setIdx] = useState(1);

    useEffect(() => {
        // If we receive a textual message
        processServerMessage('MESSAGE', serverMessage, () => {
            setMessages(prevMessages => [...prevMessages, serverMessage.message]);
            getMessageColor(serverMessage.message.from);
        });
        // If we receive a user 'connect' or 'disconnect' message
        processServerMessage('USER_CTX_MSG', serverMessage, () => {
            // Don't display our own connection message
            if (serverMessage.message.from !== displayName) {
                setMessages(prevMessages => [...prevMessages, serverMessage.message]);
            }
        });
    }, [serverMessage])

    let messagesEnd = undefined;
    useEffect(() => {
      // Scrolls to end of messages as they are added to the chat
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }, [ messages ])

    // Assigns and gets a message color for a user
    const getMessageColor = (from) => {
        if (from !== displayName && !Object.keys(colorMap).includes(from)) {
            setColorMap((prevColorMap) => ({...prevColorMap, [from]: idx}));
            setIdx(prevIdx => (prevIdx+1 > NUM_MESSAGE_COLORS) ? 1 : prevIdx+1);
        }
    }

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