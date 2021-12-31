import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const Message = ({ from, content, colorId }) => {
    const { displayName } = useContext(WebSocketContext);
    const fromSelf = (from === displayName);

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