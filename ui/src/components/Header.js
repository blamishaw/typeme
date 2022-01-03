import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { useIsMobile } from '../hooks/useIsMobile';

const Header = () => {
    const { displayName } = useContext(WebSocketContext);
    const isMobile = useIsMobile();

    return (
        <header className="header-container header">
            <h1 className="header__title">{isMobile ? "tm." : "typeme."}</h1>
            {displayName && 
                <h3 className="header__subtitle">
                    Typing as <b className="header__display-name">{displayName}</b>
                </h3>
            }
        </header>
    );
}

export default Header;