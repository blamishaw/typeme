import React, { useContext } from 'react';
import { WebSocketContext } from '../network/WebSocketContext';
import { useIsMobile } from '../hooks/mobile';
import { FaUserCircle } from 'react-icons/fa';

// Header bar component
const Header = () => {
    const { displayName } = useContext(WebSocketContext);
    const isMobile = useIsMobile();

    return (
        <header>
            <div className="header">
                <h1 className="header__title">{isMobile ? "tm." : "typeme.io"}</h1>
                {displayName && 
                    <h3 className="header__subtitle">
                        {isMobile ? 
                            <FaUserCircle className="header__icon" size={30}/> : "Typing as"} 
                        <b className="header__display-name" style={{fontSize: Math.min((12/displayName.length), 2) + 'rem'}}>{displayName}</b>
                    </h3>
                }
            </div>
        </header>
    );
}

export default Header;