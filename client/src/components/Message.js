import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const Message = ({ from, content, location, date, colorId }) => {
    const { displayName } = useContext(WebSocketContext);
    const fromSelf = (from === displayName);
    const ctxMsg = (content === 'disconnect' || content === 'connect');
    
    const getTimeStamp = (date) => {
        const timeStamp = new Date(date).toLocaleTimeString().split(':');
        const meridian = timeStamp[2].split(' ')[1]
        return `${timeStamp[0]}:${timeStamp[1]} ${meridian}`;
    }

    if (ctxMsg) {
        return (
            <div className="message-ctx">
                <p className='message-ctx__content'>User "{from}" {content}ed</p>
            </div>
        );
    }

    return (
        <div>
            <div className={`message ${fromSelf ? "self" : 'other'}`}>
                    <p className='message__timestamp'>{getTimeStamp(date)}</p>
                    <div className={`message__bubble ${fromSelf ? '' : 'color'+colorId}`}>
                        <p className="message__content">{content}</p>
                    </div>
            </div>
            {!fromSelf && <p className="message__from">{from} – {location} mi away</p>}
        </div>
    );
};

export default Message;