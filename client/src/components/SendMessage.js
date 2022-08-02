import React, { useContext, useRef, useEffect } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { getUserLocation } from '../network/location';
import { useIsMobile, useMobileSafariKeyboard } from '../hooks/mobile';
import { FaArrowUp } from 'react-icons/fa';

// Component for the send message input bar
const SendMessage = () => {
    const { displayName, sendMessage } = useContext(WebSocketContext);
    const isMobile = useIsMobile();
    
    // Messy handling of iOS keyboard to emulate native chat apps
    // I only handle iOS right now because ... I have an iPhone
    const inputElem = useRef(null);
    const formElem = useRef(null);
    useMobileSafariKeyboard(inputElem, formElem);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const inputText = e.target[0].value;
        if (inputText) {
            const message = inputText.trim();
            getUserLocation(displayName).then(
                userLocation => sendMessage('MESSAGE', { from: displayName, content: message }, userLocation)
            )
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
                    <button className='typeme-button send-message__button'>{isMobile ? <FaArrowUp /> : "Send"}</button>
                </form>
            </div>
        </footer>
    );
}

export default SendMessage;