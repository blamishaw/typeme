import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const SendMessage = () => {
    const { displayName, sendMessage } = useContext(WebSocketContext);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const inputText = e.target[0].value;
        if (inputText) {
            const message = inputText.trim();
            sendMessage('MESSAGE', { from: displayName, content: message })
        }
    }

    return (
        <div>
            <form id="send-message" autoComplete='off' onSubmit={handleSendMessage}>
                <input autoComplete='off' placeholder='Your message here'></input>
                <button>Send</button>
            </form>
        </div>
    );
}

export default SendMessage;