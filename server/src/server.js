const WebSocketServer = require('websocket').server;
// const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const port = process.env.port || 8080;

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../env/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../env/cert.pem'))
}

// Create http server and listen on designated port
const server = https.createServer(options, (req, res) => {
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

let clients = {};
let activeDisplayNames = {};

// Handle websocket server request event
wsServer.on('request', (request) => {
    // Currently accepting connection from all origins, but in the future perhaps restrict?
    const connection = request.accept(null, request.origin);

    // Create unique id for connection and add it to list of clients
    connection.id = uuid.v4();
    clients[connection.id] = connection;
    console.log((new Date()) + ` Connection ${connection.id} accepted. Active clients ${Object.keys(clients).length}`);
    

    connection.on('message', (data) => {
        if (data.type === 'utf8') {
            const { type, message } = JSON.parse(data.utf8Data);
            handleMessage(connection, type, message);
        }
    });

    // On close event, remove the connection from the list of current clients
    connection.on('close', (reasonCode, description) => {
        delete clients[connection.id];
        broadcastUTFMessage('USER_CTX_MSG', { from: activeDisplayNames[connection.id], content: 'disconnect' });
        delete activeDisplayNames[connection.id];
        console.log((new Date()) + `Connection ${connection.id} disconnected. Active clients ${Object.keys(clients).length}`);
    });
})

// Util functions
const handleMessage = (connection, type, message) => {
    switch (type) {
        case 'USER_CONNECT':
            console.log(`Received ${type} message to reserve display name "${message.displayName}" for id: ${connection.id}`);
            // Check if display name is already taken
            if (!Object.values(activeDisplayNames).includes(message.displayName)) {
                activeDisplayNames[connection.id] = message.displayName;
                sendUTFMessage(connection, 'USER_ACCEPT', message.displayName);
                broadcastUTFMessage('USER_CTX_MSG', { from: activeDisplayNames[connection.id], content: 'connect' });
            } else {
                sendUTFMessage(connection, 'USER_REJECT', message.displayName);
            }
            break;
        case 'MESSAGE':
            // Broadcast received message to all currently active clients
            console.log(`Received ${type} message from "${message.from}" with content "${message.content}"`);
            broadcastUTFMessage(type, message);
            break;
        default:
            break;
    }
}

const broadcastUTFMessage = (type, message) => {
    console.log(`Sending broadcast of type ${type} with message ${message}`);
    Object.values(clients).forEach(client => {
        if (client.id in activeDisplayNames){
            sendUTFMessage(client, type, message);
        }
    });
}

const sendUTFMessage = (connection, type, message) => {
    connection.sendUTF(JSON.stringify(
        {
            type,
            message
        }
    ))
}


