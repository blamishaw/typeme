import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { useIsMobile } from '../hooks/useIsMobile'; 

const SendMessage = () => {
    const { displayName, sendMessage } = useContext(WebSocketContext);
    const isMobile = useIsMobile();

    const handleSendMessage = (e) => {
        e.preventDefault();
        const inputText = e.target[0].value;
        if (inputText) {
            const message = inputText.trim();
            sendMessage('MESSAGE', { from: displayName, content: message });
            e.target[0].value = '';
        }
    }

    return (
        <div className='send-messages-container send-message'>
            <form className="send-message__form" autoComplete='off' onSubmit={handleSendMessage}>
                <input 
                    autoComplete='off' 
                    placeholder='Your message here'
                    className='typeme-input send-message__input'
                >    
                </input>
                <button className='typeme-button send-message__button'>{isMobile ? "–>" : "Send"}</button>
            </form>
        </div>
    );
}

export default SendMessage;