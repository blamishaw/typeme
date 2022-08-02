import React, { useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../network/WebSocketContext";
import { connect, sendWSMessage } from "../network/connect";
import Error from './Error';
import LoginModal from "./LoginModal";
import Header from "./Header";
import Messages from "./Messages";
import SendMessage from "./SendMessage";


const App = () => {

    const ws = useRef(null);
    const [serverMessage, setServerMessage] = useState({});
    const [readyState, setReadyState] = useState(0);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        return connect(ws, setServerMessage, setReadyState);
    }, [])

    const sendMessage = (type, message, location) => {
        sendWSMessage(ws, type, message, location);
    }

    if (readyState === 3) {
        return <Error errorMessage={"Cannot connect to server"}/>
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