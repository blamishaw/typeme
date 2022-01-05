import React, { useContext, useRef, useEffect } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { useIsMobile } from '../hooks/useIsMobile'; 

const SendMessage = () => {
    const { displayName, sendMessage } = useContext(WebSocketContext);
    const isMobile = useIsMobile();
    const inputElement = useRef(0);

    useEffect(() => {
        inputElement.current.onfocus = () => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
        }
    })

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
                    ref={inputElement}
                >    
                </input>
                <button className='typeme-button send-message__button'>{isMobile ? "–>" : "Send"}</button>
            </form>
        </div>
    );
}

export default SendMessage;