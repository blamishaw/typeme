import React, { useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../network/WebSocketContext";
import { connect, sendWSMessage } from "../network/connect";
import LoginForm from "./LoginForm";


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

    return (
        <WebSocketContext.Provider value={{ displayName, sendMessage, serverMessage }}>
            <LoginForm setDisplayName={setDisplayName}/>
            <h1>Sending messages as {displayName}</h1>
        </WebSocketContext.Provider>
    )
}

export default App;