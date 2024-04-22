import { handleEvent } from "./framework/handleEvent.js";
import { chatMessage } from "./components/chatMessage.js";
import { playerCard } from "./components/playerCard.js";
import { startGame, keysPressed, keysReleased } from "./game.js";
import { createPlayerCards } from "./frontendUtils.js";

const controls = document.getElementById("controls");
const joinLobbyContainer = document.getElementById("join-lobby-container");
const joinLobbyInput = document.getElementById("input-nickname");
const gameContainer = document.getElementById("game-container");
const gameStatusContainer = document.getElementById("game-status-container");
const gameStatus = document.getElementById("game-status");
const gameRestartContainer = document.getElementById("game-restart-container");
const gameRestart = document.getElementById("game-restart");
const gameEndContainer = document.getElementById("game-end-container");
const winnerBomberman = document.getElementById("winner-bomberman");
const winnerNickname = document.getElementById("winner-nickname");
const winnerText = document.getElementById("winner-text");
const gameLayout = document.getElementById("game-layout");
const gameChat = document.getElementById("game-chat");
const gameChatFeed = document.getElementById("game-chat-feed");
const inputMsg = document.getElementById("input-msg");
const playerCards = document.getElementById("player-cards");
let ws;
export let myPlayer;
export let gameState;

function createWebsocketConnection(message) {
    //ws = new WebSocket('ws://localhost:8080/');
    ws = new WebSocket('wss://bomberman-ikac.onrender.com/');
    ws.onopen = () => {
        console.log("Websocket connection established!");
        sendMessage(message);
    };
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        switch (message.action) {
            case "join lobby":
                joinLobbyInput.value = "";
                joinLobbyContainer.style.display = "none";
                controls.style.display = "block";
                gameContainer.style.display = "flex";
                gameStatus.innerHTML = `${message.gameStatus}`;
                gameChat.style.display = "flex";
                break;
    
            case "new message":
                gameChatFeed.appendChild(chatMessage(message));
                gameChatFeed.scrollTop = gameChatFeed.scrollHeight;
                break;
    
            case "game status":
                gameStatus.innerHTML = `${message.gameStatus}`;
                break;
    
            case "start game":
                gameState = message.gameState;
                myPlayer = gameState.players[gameState.playerID-1]
                gameStatusContainer.style.display = "none";
                gameStatus.innerHTML = ``;
                gameLayout.style.display = "flex";
                playerCards.style.display = "flex";
                const cards = createPlayerCards(gameState.players);
                cards.forEach(card => {
                    playerCards.appendChild(card);
                });
                startGame();
                break;

            case "player stats changed":
                gameState = message.gameState;
                myPlayer = gameState.players[gameState.playerID-1]
                const findPlayer = gameState.players.find(obj => obj.index === message.playerID);
                const currentPlayerCard = document.getElementById(`player-card-${message.playerID}`);
                const newPlayerCard = playerCard(findPlayer);
                currentPlayerCard.replaceWith(newPlayerCard);
                if (message.restart) {
                    gameStatusContainer.style.display = "flex";
                    gameRestartContainer.style.display = "block";
                    gameRestartContainer.classList.add("hide");
                    gameRestart.innerHTML = "SUDDEN DEATH";
                    setTimeout(() => {
                        gameStatusContainer.style.display = "none";
                        gameRestartContainer.style.display = "none";
                        gameRestart.innerHTML = "";
                    }, 3000);
                };
                break;

            case "game over":
                gameState = message.gameState;
                myPlayer = gameState.players[gameState.playerID-1]
                gameStatusContainer.style.display = "flex";
                gameStatusContainer.style.backgroundColor = "rgb(56, 126, 122, 0.5)";
                gameEndContainer.style.display = "flex";
                if (message.winner) {
                    const frameX = message.winner.defaultFrameX;
                    const frameY = message.winner.defaultFrameY;
                    winnerBomberman.style.display = "block";
                    winnerBomberman.style.backgroundPosition = `${frameX * 16}px ${frameY * 32 - 16}px`;
                    winnerNickname.innerHTML = message.winner.nickname;
                    winnerText.innerHTML = "WINNER";
                };
            default:
                gameState = message.gameState;
                myPlayer = gameState.players[gameState.playerID-1]
        }
    };
    ws.onclose = () => {
        console.log("Websocket connection closed!");
    };
};
export function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error("WebSocket connection not open!");
    };
};
handleEvent(joinLobbyInput, "keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const nickname = e.target.value.trim();
        if (nickname.length < 1) {
            return
        }
        const newMessage = {
            action: "join lobby",
            nickname: nickname,
        };
        createWebsocketConnection(newMessage);
    };
});
handleEvent(inputMsg, "keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const content = e.target.value.trim();
        if (content.length < 1) {
            return
        };
        const newMessage = {
            action: "new message",
            content: content,
        };
        sendMessage(newMessage, ws);
        inputMsg.value = "";
        inputMsg.focus();
    };
});
handleEvent(window, "keydown", (e) => {
    if (document.activeElement !== inputMsg) {
        keysPressed(e);
    };
});
handleEvent(window, "keyup", (e) => {
    if (document.activeElement !== inputMsg) {
        keysReleased(e);
    };
});
