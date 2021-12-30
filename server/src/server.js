const WebSocketServer = require('websocket').server;
const http = require('http');
const uuid = require('uuid');
const port = process.env.port || 8080;

const server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
})

server.listen(port, () => {
    console.log("Server is now listening on port " + port);
})

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

let clients = {};

wsServer.on('request', (request) => {
    const connection = request.accept('echo-protocol', request.origin);
    connection.id = uuid.v4();
    clients[connection.id] = connection;
    console.log((new Date()) + `Connection ${connection.id} accepted. Active clients ${Object.keys(clients).length}`);
    

    connection.on('message', (data) => {
        if (data.type === 'utf8') {
            const { type, message } = JSON.parse(data.utf8Data);
            console.log('Received Message: ' + message);

            for (let client of Object.values(clients)) {
                client.sendUTF(data.utf8Data);
            }
            
        }
    });

    connection.on('close', (reasonCode, description) => {
        delete clients[connection.id];
        console.log((new Date()) + `Connection ${connection.id} disconnected. Active clients ${Object.keys(clients).length}`);
    });
})



