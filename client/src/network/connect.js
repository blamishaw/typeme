import { w3cwebsocket as W3CWebSocket } from 'websocket';

const MAX_RECONNECT_ATTEMPTS = 5;

// Client websocket connection function
// On socket close, we attempt to reconnect to the server with an exponential backoff
let missedHeartBeats = 0;
export const connect = (ws, setServerMessage, setReadyState) => {
    ws.current = new W3CWebSocket(process.env.REACT_APP_DEV_HOSTNAME);

    ws.current.onopen = () => {
        console.log('Client Connected');
        setReadyState(ws.current.readyState);
        missedHeartBeats = 0;
    }

    ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setServerMessage(data);
    };

    ws.current.onclose = () => {
        console.log("Websocket closed. Attempting to reconnect...");
        setReadyState(ws.current.readyState);
        try {
            if (missedHeartBeats < MAX_RECONNECT_ATTEMPTS) {
                setTimeout(() => {
                    missedHeartBeats++;
                    connect(ws, setServerMessage, setReadyState);
                }, Math.pow(10, missedHeartBeats));
            } else {
                throw new Error("Missed too many heartbeats, reconnect failed.")
            }
        } catch(e) {
            console.warn(e);
        }
    }

    ws.current.onerror = (err) => {
        // If we cannot connect to the websocket, try an exponential timeout
        console.log("Websocket encountered error");
        ws.current.close();
    }

    return () => ws.current.close();
}

// Send message to server
export const sendWSMessage = (ws, type, message) => {
    try {
        ws.current.send(JSON.stringify({
            type,
            message
        }));
    } catch(e) {
        throw new Error("Message failed to send.");
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