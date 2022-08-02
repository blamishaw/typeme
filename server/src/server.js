const WebSocketServer = require('websocket').server;
const http = require('http');
const uuid = require('uuid');
const utils = require('./utils');
const port = process.env.PORT || 8080;

const MAX_CONNECTIONS = 8;

// Create http server and listen on designated port
const server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
})

server.listen(port, () => {
    console.log("HTTP server is now listening on port " + port);
})

// Create new websocket server mounted on http server
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


let activeDisplayNames = {};
let locationMetadata = {};

// Handle websocket server request event
wsServer.on('request', (request) => {
    // Currently accepting connection from all origins, but in the future perhaps restrict?
    const connection = request.accept(null, request.origin);
    // Create unique id for connection and add it to list of clients
    connection.id = uuid.v4();
    console.log((new Date()) + ` Connection ${connection.id} accepted.\nActive clients ${getActiveClients()}`); 
    
    // Send connection reject if more than MAX_CONNECTIONS are in the chatroom
    // This is mostly to avoid the problems (race-conditions) that occurs with many users
    if (getActiveClients() > MAX_CONNECTIONS) {
        console.log('Rejecting connection as chatroom is full');
        sendUTFMessage(connection, 'CTX_REJECT', 'Chatroom is full');
        connection.close();
        return;
    }

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            const data = JSON.parse(message.utf8Data);
            
            handleMessage(connection, data);
        }
    });


    // On close event, remove the connection from the list of current clients
    connection.on('close', (reasonCode, description) => {
        if (connection.id in activeDisplayNames) {
            broadcastUTFMessage('USER_CTX_MSG', { from: activeDisplayNames[connection.id], content: 'disconnect' }, null);
            delete activeDisplayNames[connection.id];
            delete locationMetadata[connection.id];
        }
        console.log((new Date()) + `Connection ${connection.id} disconnected.\nActive clients ${getActiveClients()}`);
    });
})

// Handle message payloads from clients
const handleMessage = (connection, data) => {
    const { type, message, location } = data;
    switch (type) {
        case 'USER_CONNECT':
            const { displayName } = message;
            console.log(`Received ${type} message to reserve display name "${displayName}" for id: ${connection.id}`);
            // Check if display name is already taken
            if (!Object.values(activeDisplayNames).includes(displayName)) {
                // Store display name and location information
                activeDisplayNames[connection.id] = displayName;
                locationMetadata[connection.id] = location;
                // Send ctx accept message back to user and broadcast user connected to all connected clients
                sendUTFMessage(connection, 'USER_ACCEPT', displayName, location);
                broadcastUTFMessage('USER_CTX_MSG', { from: activeDisplayNames[connection.id], content: 'connect' }, location);
            } else {
                sendUTFMessage(connection, 'USER_REJECT', displayName, location);
            }
            break;
        case 'MESSAGE':
            // Broadcast received message to all currently active clients
            console.log(`Received ${type} message from "${message.from}" with content "${message.content}"`);
            locationMetadata[connection.id] = location;
            broadcastUTFMessage(type, message, location);
            break;
        default:
            console.log(`Received ${type} with message %j`, message);
            break;
    }
}

// Broadcast message to all connected clients
const broadcastUTFMessage = (type, message, location) => {
    console.log(`Sending broadcast of type ${type} with message %j from location %j`, message, location);
    wsServer.connections.forEach(client => {
        if (client.id in activeDisplayNames){
            const distanceBetweenClients = utils.getHaversineDistance(location, locationMetadata[client.id]);
            sendUTFMessage(client, type, message, distanceBetweenClients);
        }
    });
}

// Send message over connection in UTF format
const sendUTFMessage = (connection, type, message, location) => {
    connection.sendUTF(JSON.stringify(
        {
            type,
            message,
            location,
            date: new Date()
        }
    ))
}

const getActiveClients = () => {
    return wsServer.connections.length;
}


