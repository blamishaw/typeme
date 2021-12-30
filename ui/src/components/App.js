import React, { useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../network/WebSocketContext";
import { connect, sendMessage } from "../network/connect";


const App = () => {

    const ws = useRef(null);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        return connect(ws);
    }, [])


    return (
        <WebSocketContext.Provider value={{ displayName, sendMessage }}>
            <button onClick={() => sendMessage(ws, 'MESSAGE', 'Button Clicked')}>Send Message</button>
        </WebSocketContext.Provider>
    )
}

export default App;