import React, { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { WebSocketContext } from "../context/WebSocketContext";

const port = 8080;

const App = () => {

    const ws = useRef(null);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        ws.current = new W3CWebSocket(`ws://${window.location.hostname}:${port}`, 'echo-protocol');
        ws.current.onopen = () => {
            console.log('WebSocket Client Connected');
            sendMessage('MESSAGE', 'HELLO'); 
        }

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
        };

        return () => ws.current.close();
    }, [])

    const sendMessage = (type, message) => {
        ws.current.send(JSON.stringify({
            type,
            message
        }));
    }

    const handleSubmitDisplayName = (e) => {
        e.preventDefault();
        const inputText = e.target[0].value;
        if (inputText) {
            setDisplayName(inputText);
        }
        e.target[0].value = '';
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault();
        
        const inputText = e.target[0].value;
        if (inputText) {
            sendMessage('MESSAGE', { from: displayName, message: inputText })
        }
        e.target[0].value = '';
    }

    return (
        <WebSocketContext.Provider value={{ sendMessage }}>
            {displayName}
            <form autoComplete="off" onSubmit={handleSubmitDisplayName}>
                <input autoComplete="off" placeholder="Display Name"></input>
                <button>Submit</button>
            </form>
            <form autoComplete="off" onSubmit={handleSubmitMessage}>
                <input autoComplete="off" placeholder="Message" />
                <button>Submit</button>
            </form>
            <div id="messages">
            </div>
        </WebSocketContext.Provider>
    )
}

export default App;