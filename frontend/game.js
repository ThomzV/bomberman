import { gameState, sendMessage, myPlayer } from "./setup.js";
import { bombermanChar } from "./components/bombermanChar.js";
import { arenaBlock } from "./components/arenaBlock.js";

const world = document.getElementById('game-layout');
const chars = document.getElementById("game-chars");
const defaultFPS = 60;
const bombPics = [13, 13, 14, 14, 15, 15, 14, 14, 13, 13, 14, 14, 15, 15, 14, 14, 13, 13, 14, 14];
const enemyBomb = [10, 10, 11, 11, 12, 12, 11, 11, 10, 10, 11, 11, 12, 12, 11, 11, 10, 10, 11, 11];
let divMap = [];
let divRow = [];
let keys = [];
keys[37] = false;
keys[38] = false;
keys[39] = false;
keys[40] = false;
let currentTime;
let startTime;
let start;
let currentFrame;
let lastFrame = 0;
let delta;
let interval = 1000/defaultFPS;
let deltaXbomb = 0;
let deltaYbomb = 0;
let bombID = 0;
export function keysPressed(e) {
    if (e.repeat) {
        return;
    };
    keys[e.keyCode] = true;
};
export function keysReleased(e) {
    keys[e.keyCode] = false;
};
export function startGame() {   // create arena, create bombermans and start gameloop
    makeArenaBlocks(gameState);
    makeBombermanChars(gameState);
    requestAnimationFrame(gameLoop);
};
function makeBombermanChars(gameState) {    //  create playable characters
    for (let i = 0; i < gameState.players.length; i++) {
        const newBombermanChar = bombermanChar(gameState.players[i]);
        chars.append(newBombermanChar);
    };
};
function makeArenaBlocks(gameState) {   //  create game arena
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 15; x++) {
            const elementX = ((gameState.arena[y][x] % 6) * 16);
            const elementY = (Math.ceil(gameState.arena[y][x]/6) * 16);
            const newBlock = arenaBlock(elementX, elementY);
            world.appendChild(newBlock);
            divRow.push(newBlock);
        };
        divMap.push(divRow);
        divRow = [];
    };
};
function drawLayout() { // function to show correct piece of image sprite on each element in arena
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 15; x++) {
            if (typeof gameState.arena[y][x] !== "number") {
                if (gameState.arena[y][x][0] === gameState.playerID) {
                    gameState.arena[y][x] = bombPics[Number(gameState.arena[y][x][1])];
                } else {
                    gameState.arena[y][x] = enemyBomb[Number(gameState.arena[y][x][1])];
                };
            };
            const elementx = ((gameState.arena[y][x] % 6) * 16);
            const elementy = (Math.ceil(gameState.arena[y][x]/6) * 16);
            divMap[y][x].style.backgroundPosition = `${elementx}px ${elementy}px`;
        };
    };
};
function drawMan (player) { //  function to show correct piece of image sprite on bomberman
    const frameX = player.loop[player.xIndex];
    const frameY = player.yIndex;
    const bomberMan = document.getElementById(player.index);
    bomberMan.style.opacity = player.opacity;
    const elementx = frameX * 16;
    const elementy = (frameY * 32) - 16;
    bomberMan.style.backgroundPosition = `${elementx}px ${elementy}px`;
    bomberMan.style.transform = `translate(${player.manX *16}px, ${player.manY *16}px)`;
};

function movementMan() { //function to read players inputs and moving character based on them
    let hasMoved = false;
    let change = false;
    if (keys[37]) { //left arrow key
        if (!myPlayer.keys.includes("left")) {
            myPlayer.keys.push("left");
            hasMoved = true;
            change = true;
        };
    } else {
        if (myPlayer.keys.includes("left")) {
            const newKeys = myPlayer.keys.filter(index => index !== "left");
            myPlayer.keys = newKeys;
            change = true;
        };
    };
    if (keys[39]) { //right arrow key
        if (!myPlayer.keys.includes("right")) {
            myPlayer.keys.push("right");
            hasMoved = true;
            change = true;
        };
    } else {
        if (myPlayer.keys.includes("right")) {
            change = true;
            const newKeys = myPlayer.keys.filter(index => index !== "right");
            myPlayer.keys = newKeys;
        };
    };
    if (keys[38]) { //up arrow key
        if (!myPlayer.keys.includes("up")) {
            myPlayer.keys.push("up");
            change = true;
            hasMoved = true;
        };
    } else {
        if (myPlayer.keys.includes("up")) {
            change = true;
            const newKeys = myPlayer.keys.filter(index => index !== "up");
            myPlayer.keys = newKeys;
        };
    };
    if (keys[40]) { //down arrow key
        if (!myPlayer.keys.includes("down")) {
                myPlayer.keys.push("down");
                hasMoved = true;
                change = true;
        };
    } else {
        if (myPlayer.keys.includes("down")) {
            change = true;
            const newKeys = myPlayer.keys.filter(index => index !== "down");
            myPlayer.keys = newKeys;
        };
    };
    if (change) {
        if (myPlayer.keys.length !== 0) {
            hasMoved = true;
        };
        if (hasMoved) {
            myPlayer.stopMoving = false;
        };
        if (!hasMoved) {
            myPlayer.stopMoving = true;
        };
        myPlayer.isMoving = hasMoved;
        const newMessage = {
            action: "movement",
            content: myPlayer,
        };
        sendMessage(newMessage);
    };
};
function checkIfNextOrPrevBox(a) {  //  function that rounds bomb coordinates (it always lands on the center of the box, not between them)
    let b = a % 1;
    if(b < 0.5 && b > 0) {
        a = Math.floor(a);
    } else if(b >= 0.5 && b < 1) {
        a = Math.ceil(a);
    }
    return a;
};
function bomba(playerID) {  //  function to handle bombs and creating timeouts for animations
    let limit = false;
    if (gameState.players[playerID-1].bombLimit === gameState.players[playerID-1].bombs.length) {
        limit = true;
    };
    const mensX = checkIfNextOrPrevBox(gameState.players[playerID-1].manX);
    const mensY = checkIfNextOrPrevBox(gameState.players[playerID-1].manY);
    if (keys[32] && !limit && gameState.arena[mensY][mensX] === 1 && !gameState.players[playerID-1].manDied) {
        deltaXbomb = checkIfNextOrPrevBox(gameState.players[playerID-1].manX);
        deltaYbomb = checkIfNextOrPrevBox(gameState.players[playerID-1].manY);
        keys[32] = false;
        bombID++;
        let newBomb = {
            id: bombID,
            owner: playerID,
            x: deltaXbomb,
            y: deltaYbomb,
            radius: gameState.players[playerID-1].bombRadius,
            bombTimeIndex: 0,
            bombIndex: 0,
            explosionIndex: 0,
            bombToBomb: "",
        };
        const newMessage = {
            action: "bombPlant",
            content: newBomb,
        };
        sendMessage(newMessage);
    };
};
function gameLoop(time) {   //  main gameloop
    currentTime = Date.now();
    if (currentTime - startTime >= 1000) {  //  fps counter updates after 1s
        startTime = currentTime
    }
    if (start === undefined){
        start = time;
        startTime = currentTime;
    } else {
        currentFrame = Math.round((time - start) / interval);
        delta = (currentFrame - lastFrame) * interval;
    }
    if ((delta >= interval)) { //  make game run at 60FPS
        bomba(gameState.playerID);
        if (!gameState.players[gameState.playerID-1].manDied) {
            movementMan(gameState.playerID);
        } 
        for (let i = 0; i < gameState.players.length; i++) {
            drawMan(gameState.players[i]);
        };
        drawLayout();
        lastFrame = currentFrame;
    } 
    if (gameState.gameOver) return;
    requestAnimationFrame(gameLoop);
};