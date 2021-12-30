import React, { useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../network/WebSocketContext";
import { connect, sendWSMessage } from "../network/connect";
import LoginForm from "./LoginForm";
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

    return (
        <WebSocketContext.Provider value={{ displayName, sendMessage, serverMessage }}>
            <LoginForm setDisplayName={setDisplayName}/>
            {displayName && 
                <>
                    <Header />
                    <Messages />
                    <SendMessage />
                </>
            }
        </WebSocketContext.Provider>
    );
}

export default App;