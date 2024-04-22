const { getCurrentTime } = require('./backendUtils');
const { gameState, makePlayer, bombaHandler, createArena, makePowerups, movementMan } = require('./game');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
let playerIndex = 1;
let countdownStarted = false;
let waitTimeLobbyEnded = false;
let maxPlayers = false;
let gameStarted = false;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    // If the requested URL is '/', serve index.html
    if (filePath === './') {
        filePath = '../frontend/index.html';
    }
    // If the requested URL is a static file, construct the file path relative to the server file
    if (filePath.startsWith('./frontend/')) {
        filePath = '..' + req.url;
    }
    // Determine the file extension to set the appropriate content type
    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
      }[extname] || 'application/octet-stream';
    // Read the file and serve it with the appropriate content type
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        };
    });
});
server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    if (gameStarted) {
        ws.close(1000, "Connection closed by server. Game already started!");
        return
    };
    ws.id = playerIndex;
    console.log(` ${ws.id} Client connected`);
    const player = makePlayer(playerIndex);
    gameState.players.push(player);
    gameState.alivePlayers.push(playerIndex);
    playerIndex++;

    ws.on('message', function incoming(message) {
        const receivedMsg = JSON.parse(message);
        var findPlayer = gameState.players.find(obj => obj.index === ws.id);
        switch (receivedMsg.action) {
            case "movement":
                for (let i = 0; i < gameState.players.length; i++) {
                    if (gameState.players[i].index === receivedMsg.content.index) {
                        const sortedClient = receivedMsg.content.keys.slice().sort();
                        const compare = (gameState.players[i].keys.length === receivedMsg.content.keys.length && gameState.players[i].keys.slice().sort().every(function(value, index) {
                            return value === sortedClient[index];
                        }));
                        if (!compare) {
                            if (receivedMsg.content.keys.length !== 0 && gameState.players[i].keys.length === 0) {
                                gameState.players[i].startMoving = true;
                            };
                            gameState.players[i].keys = receivedMsg.content.keys;
                            gameState.players[i].isMoving = receivedMsg.content.isMoving;
                            gameState.players[i].stopMoving = receivedMsg.content.stopMoving;
                            movementMan(gameState.players[i].index, sendData);
                        };
                    };
                };
                break
            case "bombPlant":
                gameState.bombs.push(receivedMsg.content);
                bombaHandler(receivedMsg.content, sendData);
                break
            case "join lobby":
                joinLobby(receivedMsg, ws);
                break
            case "new message":
                const time = getCurrentTime();
                const newMessage = {
                    action: receivedMsg.action,
                    time: time,
                    sender: findPlayer.nickname,
                    content: receivedMsg.content,
                };
                sendData(newMessage);
                break
        };
    });
    ws.on('close', function () {
        console.log('Client disconnected');
    });
});

function sendData(data) {   //  send data back to clients on frontend
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            gameState.playerID = client.id; // Set the playerID for this client
            client.send(JSON.stringify(data)); // Send the new message
        };
    });
};
function joinLobby(receivedMsg, ws) {   //  add new user to the lobby
    if (playerIndex <= 5 && !gameStarted) {
        const findPlayer = gameState.players.find(obj => obj.index === ws.id);
        if (findPlayer) {
            findPlayer.nickname = receivedMsg.nickname;
        };
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN && ws.id === client.id) {
                const gameStatus = playerIndex === 2 ? "Waiting for players... [1/4]" : "";
                const newMessage = {
                    action: receivedMsg.action,
                    gameStatus: gameStatus,
                };
                client.send(JSON.stringify(newMessage));
            } else {
                const timeNow = getCurrentTime();
                const newMessage = {
                    action: "new message",
                    time: timeNow,
                    sender: receivedMsg.nickname,
                    content: "Joined the chatroom!",
                };
                client.send(JSON.stringify(newMessage));
            };
        });
        if (playerIndex === 5) {
            maxPlayers = true;
        } else if (playerIndex > 2 && !countdownStarted) {
            startCountdown(30);
        };
    } else {
        console.log("Game lobby is full!")
    };
};
function startCountdown(count) {    // starts countdown in lobby
    countdownStarted = true;
    const timer = setInterval(() => {
        if (count < 0) {
            clearInterval(timer);
            console.log("Countdown finished");
            gameStarted = true;
            startGame();
        } else {
            if (count === 10 && !maxPlayers) {
                waitTimeLobbyEnded = true;
                count = 10;
            };
            if (maxPlayers && !waitTimeLobbyEnded) {
                waitTimeLobbyEnded = true;
                count = 10;
            };
            const gameStatus = waitTimeLobbyEnded ? `Game starting in ${count} seconds! [${gameState.players.length}/4]` : `Waiting for players... Lobby is closing in ${count - 10} seconds! [${gameState.players.length}/4]`;
            const newMessage = {
                action: "game status",
                gameStatus: gameStatus,
            };
            sendData(newMessage);
            count--;
        };
    }, 1000);
};
function startGame() {  //  create game layout and send it to players
    createArena();
    makePowerups(gameState.players.length);
    const newMessage = {
      action: "start game",
      gameState: gameState,
    };
    sendData(newMessage);
};
