import { w3cwebsocket as W3CWebSocket } from 'websocket';

const MAX_RECONNECT_SCALE = 5;
const PORT = 8080;

// Client websocket connection function
// On socket close, we attempt to reconnect to the server with an exponential backoff
let attemptedConnects = 1;
export const connect = (ws) => {
    ws.current = new W3CWebSocket(`ws://${window.location.hostname}:${PORT}`);

    ws.current.onopen = () => {
        console.log('WebSocket Client Connected');
        sendMessage(ws, 'MESSAGE', 'Hello from client'); 
    }

    ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
    };

    ws.current.onclose = () => {
        console.log("Websocket closed. Attempting to reconnect...");
        setTimeout(() => {
            connect(ws);
            attemptedConnects = (attemptedConnects+1 > MAX_RECONNECT_SCALE) ? 
                                        MAX_RECONNECT_SCALE : attemptedConnects+1;
        }, Math.pow(10, attemptedConnects));
    }

    ws.current.onerror = (err) => {
        // If we cannot connect to the websocket, try an exponential timeout
        console.log("Websocket encountered error");
        ws.current.close();
    }

    return () => ws.current.close();
}

// Send message to server
export const sendMessage = (ws, type, message) => {
    ws.current.send(JSON.stringify({
        type,
        message
    }));
}