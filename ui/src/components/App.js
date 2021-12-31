import React, { useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../network/WebSocketContext";
import { connect, sendWSMessage } from "../network/connect";
import LoginModal from "./LoginModal";
import Header from "./Header";
import Messages from "./Messages";
import SendMessage from "./SendMessage";


const App = () => {

    const ws = useRef(null);
    const [serverMessage, setServerMessage] = useState({});
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        return connect(ws, setServerMessage);
    }, [])

    const sendMessage = (type, message) => {
        sendWSMessage(ws, type, message);
    }

    if (ws.current && ws.current.readyState === 3) {
        return <h1>Cannot connect to server</h1>
    }
    return (
        <WebSocketContext.Provider value={{ displayName, sendMessage, serverMessage }}>
            <LoginModal setDisplayName={setDisplayName}/>
            <div className="grid-container">
                <Header />
                <Messages />
                <SendMessage />
            </div>
            
        </WebSocketContext.Provider>
    );
}

export default App;