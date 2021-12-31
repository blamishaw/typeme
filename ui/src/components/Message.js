import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const Message = ({ from, content, colorId }) => {
    const { displayName } = useContext(WebSocketContext);
    const fromSelf = (from === displayName);
    const ctxMsg = (content === 'disconnect' || content === 'connect');

    if (ctxMsg) {
        return (
            <div className="message-ctx">
                <p className='message-ctx__content'>User "{from}" {content}ed</p>
            </div>
        );
    }

    return (
        <div>
            <div className={`message ${fromSelf ? "self" : `other-${colorId}`}`}>
                <p className="message__content">{content}</p>
            </div>
            {!fromSelf && <p className="message__from">{from}</p>}
        </div>
    );
}

export default Message;