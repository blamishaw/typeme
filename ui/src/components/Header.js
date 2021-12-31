import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const Header = () => {
    const { displayName } = useContext(WebSocketContext);

    return (
        <header>
            <h1>Send messages as {displayName}</h1>
        </header>
    );
}

export default Header;