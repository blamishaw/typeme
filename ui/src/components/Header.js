import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';

const Header = () => {
    const { displayName } = useContext(WebSocketContext);

    return (
        <header className="header-container header">
            <h1 className="header__title">typeme.</h1>
            {displayName && 
                <h3 className="header__subtitle">
                    Typing as <b className="header__display-name">{displayName}</b>
                </h3>
            }
        </header>
    );
}

export default Header;