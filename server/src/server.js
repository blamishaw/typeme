const WebSocketServer = require('websocket').server;
const http = require('http');
const uuid = require('uuid');
const port = process.env.port || 8080;

// Create http server and listen on designated port
const server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
})

server.listen(port, () => {
    console.log("Server is now listening on port " + port);
})

// Create new websocket server mounted on http server
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

let clients = {};

// Handle websocket server request event
wsServer.on('request', (request) => {
    // Currently accepting connection from all origins, but in the future perhaps restrict?
    const connection = request.accept(null, request.origin);

    // Create unique id for connection and add it to list of clients
    connection.id = uuid.v4();
    clients[connection.id] = connection;
    console.log((new Date()) + `Connection ${connection.id} accepted. Active clients ${Object.keys(clients).length}`);
    

    connection.on('message', (data) => {
        if (data.type === 'utf8') {
            const { type, message } = JSON.parse(data.utf8Data);
            console.log('Received Message: ' + message);

            // Broadcast received message to all currently active clients
            for (let client of Object.values(clients)) {
                client.sendUTF(data.utf8Data);
            }
            
        }
    });

    // On close event, remove the connection from the list of current clients
    connection.on('close', (reasonCode, description) => {
        delete clients[connection.id];
        console.log((new Date()) + `Connection ${connection.id} disconnected. Active clients ${Object.keys(clients).length}`);
    });
})



