import { w3cwebsocket as W3CWebSocket } from 'websocket';

const MAX_RECONNECT_SCALE = 5;

// Client websocket connection function
// On socket close, we attempt to reconnect to the server with an exponential backoff
let attemptedConnects = 1;
export const connect = (ws, setServerMessage) => {
    ws.current = new W3CWebSocket(process.env.REACT_APP_DEV_HOSTNAME);

    ws.current.onopen = () => {
        console.log('WebSocket Client Connected');
    }

    ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setServerMessage(data);
    };

    ws.current.onclose = () => {
        console.log("Websocket closed. Attempting to reconnect...");
        setTimeout(() => {
            connect(ws);
            attemptedConnects = Math.min(MAX_RECONNECT_SCALE, attemptedConnects+1);
        }, Math.pow(10, attemptedConnects));
    }

    ws.current.onerror = (err) => {
        // If we cannot connect to the websocket, try an exponential timeout
        console.log(err, "Websocket encountered error");
        ws.current.close();
    }

    return () => ws.current.close();
}

// Send message to server
export const sendWSMessage = (ws, type, message) => {
    if (ws.current.readyState === 1) {
        ws.current.send(JSON.stringify({
            type,
            message
        }));
    } else {
        console.log("Websocket ready state ", ws.current.readyState);
    }
    
}

// Run callback if serverMessage contains the type specified
export const processServerMessage = (type, serverMessage, callback) => {
    if (typeof serverMessage.type === 'string') {
        if (serverMessage.type === type) {
            callback();
        }
    }
}