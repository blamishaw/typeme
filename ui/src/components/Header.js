import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { useIsMobile } from '../hooks/mobile';

const Header = () => {
    const { displayName } = useContext(WebSocketContext);
    const isMobile = useIsMobile();

    return (
        <header>
            <div className="header">
                <h1 className="header__title">{isMobile ? "tm." : "typeme.io"}</h1>
                {displayName && 
                    <h3 className="header__subtitle">
                        Typing as <b className="header__display-name">{displayName}</b>
                    </h3>
                }
            </div>
        </header>
    );
}

export default Header;