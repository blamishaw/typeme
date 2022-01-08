import React, { useContext, useRef, useEffect } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { useIsMobile, useMobileSafariKeyboard } from '../hooks/mobile'; 

const SendMessage = () => {
    const { displayName, sendMessage } = useContext(WebSocketContext);
    const isMobile = useIsMobile();
    
    const inputElem = useRef(null);
    const formElem = useRef(null);
    useMobileSafariKeyboard(inputElem, formElem);

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
        <footer>
            <div className="send-message" ref={formElem}>
                <form className="send-message__form" autoComplete='off' onSubmit={handleSendMessage}>
                    <input 
                        autoComplete='off' 
                        placeholder='Your message here'
                        className='typeme-input send-message__input'
                        ref={inputElem}
                    >    
                    </input>
                    <button className='typeme-button send-message__button'>{isMobile ? "–>" : "Send"}</button>
                </form>
            </div>
        </footer>
    );
}

export default SendMessage;