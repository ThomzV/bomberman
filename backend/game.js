const gameState = {
    players: [],
    playerID: 0,
    dir : ["up", "down", "left", "right"],
    baseMap : [
    [17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17],
    [17,  0,  0,  ,    ,   ,   ,   ,   ,   ,   ,   ,  0,  0, 17],
    [17,  0, 17,  ,  17,   , 17,   , 17,   , 17,   , 17,  0, 17],
    [17,   ,   ,  ,    ,   ,   ,   ,   ,   ,   ,   ,   ,   , 17],
    [17,   , 17,  ,  17,   , 17,   , 17,   , 17,   , 17,   , 17],
    [17,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   , 17],
    [17,   , 17,   , 17,   , 17,   , 17,   , 17,   , 17,   , 17],
    [17,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   , 17],
    [17,   , 17,  ,  17,   , 17,   , 17,   , 17,   , 17,   , 17],
    [17,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   , 17],
    [17,  0, 17,  ,  17,   , 17,   , 17,   , 17,   , 17,  0, 17],
    [17,  0,  0,   ,   ,   ,   ,   ,   ,   ,   ,   ,  0,  0, 17],
    [17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17]
    ],
    softwalls : [],
    extraBombs : [],
    biggerBombs : [],
    fasterSpeed: [],
    manX : 1,
    manY : 1,
    arena : [],
    validBoxes: [],
    emptyBoxes: [],
    alivePlayers: [],
    bombs: [],
    gameOver: false,
};
const brickDel = [9, 8, 8, 7, 7, 4, 4, 3, 3, 6];
const powerDel = [102, 101, 101, 100, 100, 99, 99, 98, 98, 97];
const explosionCenter = [66, 65, 64, 63, 62, 63, 64, 65, 66, 1];
const explosionUp = [84, 83, 82, 81, 80, 81, 82, 83, 84, 1];
const explosionDown = [72, 71, 70, 69, 68, 69, 70, 71, 72, 1];
const explosionRight = [78, 77, 76, 75, 74, 75, 76, 77, 78, 1];
const explosionLeft = [90, 89, 88, 87, 86, 87, 88, 89, 90, 1];
const explosionSideAddon = [95, 94, 93, 92, 91, 92, 93, 94, 95, 1];
const explosionAddon = [61, 67, 73, 79, 85, 79, 73, 67, 61, 1];
const immortalOpacity = ["1", "0.5", "1"];

function makePlayer(playerIndex) {
    let  player = {
      index: playerIndex,
      nickname: "",
      manX: 0,
      manY: 0,
      xIndex: 0,
      yIndex: 0,
      loop: [5,4,5,6],
      isMoving: false,
      bombLimit: 1,
      movementSpeed: 0.0625,
      bombs: [],
      bombRadius: 1,
      lives: 3,
      manDied: false,
      immortal: false,
      opacity: "1",
      immortalIndex: 0,
      immortalFrame: 0,
      immortalTimeIndex: 0,
      deadTimer: 0,
      deathFrames: 0,
      defaultFrameX: 5,
      defaultFrameY: 0,
      defaultDeadFrameX: 1,
      defaultDeadFrameY: 0,
      keys: [],
      moveFrames: 0,
      deathTime: 0,
    };
    if (playerIndex === 1) {
      player.manX = 1;
      player.manY = 1;
      player.yIndex = 3;
      player.defaultFrameY = 3;
      player.defaultDeadFrameY = 5.5;
    };
    if (playerIndex === 2) {
      player.manX = 13;
      player.manY = 11;
      player.yIndex = 10;
      player.defaultFrameY = 10;
      player.defaultDeadFrameY = 12;
    };
    if (playerIndex === 3) {
      player.manX = 13;
      player.manY = 1;
      player.yIndex = 13;
      player.defaultFrameY = 13;
      player.defaultDeadFrameY = 15;
    };
    if (playerIndex === 4) {
      player.manX = 1;
      player.manY = 11;
      player.yIndex = 16;
      player.defaultFrameY = 16;
      player.defaultDeadFrameY = 18;
    };
    return player;
};
function checkIfNextOrPrevBox(a) {  //  function that rounds bomb coordinates (it always lands on the center of the box, not between them)
    let b = a % 1;
    if (b < 0.5 && b > 0) {
        a = Math.floor(a);
    } else if (b>=0.5 && b<1) {
        a = Math.ceil(a);
    };
    return a;
};
function findEmpty(player) {    //  function to create an array of empty squares on arena so we can randomly place bombermans after death
    let index = 0;
    gameState.emptyBoxes = [];
    gameState.validBoxes = [];
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 15; x++) {
            if (gameState.arena[y][x] == 1) {
                gameState.emptyBoxes.push(index);
            };
            index++
        };
    };
    for (let j = 0; j < gameState.emptyBoxes.length; j++) {
        let count = 0;
        if (gameState.emptyBoxes.includes(gameState.emptyBoxes[j] - 1)) {
            count++
        };
        if (gameState.emptyBoxes.includes(gameState.emptyBoxes[j] - 15)) {
            count++
        };
        if (gameState.emptyBoxes.includes(gameState.emptyBoxes[j] + 1)) {
            count++
        };
        if (gameState.emptyBoxes.includes(gameState.emptyBoxes[j] + 15)) {
            count++
        };
        if (count >= 2) {
            gameState.validBoxes.push(gameState.emptyBoxes[j]);
        };
    };
    for (let i = 0; i < gameState.validBoxes.length; i++) {
        const x = Math.floor(gameState.validBoxes[i]%15);
        const y = Math.floor(gameState.validBoxes[i]/15);
        for (let j = 0; j < gameState.players.length; j++) {
            if (gameState.players[j].index !== player.index) {
                const mensX = checkIfNextOrPrevBox(gameState.players[j].manX);
                const mensY = checkIfNextOrPrevBox(gameState.players[j].manY);
                if (((Math.abs(x - mensX) <= 3) || (Math.abs(mensX - x) <= 3)) && ((Math.abs(y - mensY) <= 3) || (Math.abs(mensY - y) <= 3))) {
                    gameState.validBoxes[i] = 0;
                };
            };
        };
    };
    let spawnBoxes = [];
    gameState.validBoxes.forEach((index) => {
        if (index !== 0) {
            spawnBoxes.push(index);
        };
    });
    let randomIndex = Math.floor(Math.random() * spawnBoxes.length);
    gameState.players[player.index - 1].manY = Math.floor(spawnBoxes[randomIndex]/15);
    gameState.players[player.index - 1].manX = Math.floor(spawnBoxes[randomIndex]%15);
};
function deadMan(player, sendData) {  //  function for handling bomberman death
    let deathTick = setInterval(deathTime, 200);
    function deathTime() {
        gameState.players[player-1].stopMoving = true;
        gameState.players[player-1].loop = [6, 5, 4, 3, 2, 1];
        if (player === 1) {
            gameState.players[player-1].yIndex = 5.5;
        } else if (player === 2){
            gameState.players[player-1].yIndex = 12;
        } else if (player === 3){
            gameState.players[player-1].yIndex = 15;
        } else if (player === 4){
            gameState.players[player-1].yIndex = 18;
        };
        if (gameState.players[player-1].deathFrames === 10) {
            if (gameState.players[player-1].lives > 0) {
                if (player === 1) {
                    gameState.players[player-1].yIndex = 3;
                } else if (player === 2){
                    gameState.players[player-1].yIndex = 10;
                } else if (player === 3){
                    gameState.players[player-1].yIndex = 13;
                } else if (player === 4){
                    gameState.players[player-1].yIndex = 16;
                };
                gameState.players[player-1].loop = [5,4,5,6];
                gameState.players[player-1].xIndex = 0;
                immortalityHandler(player, sendData);
                gameState.players[player-1].manDied = false;
                gameState.players[player-1].bombRadius = 1;
                gameState.players[player-1].bombLimit = 1;
                gameState.players[player-1].movementSpeed =  0.0625;
                gameState.players[player-1].keys = [];
                gameState.players[player-1].deathFrames = 0;
                findEmpty(gameState.players[player-1]);
            } else {
                const index = gameState.alivePlayers.indexOf(gameState.players[player-1].index);
                if (index !== -1) {
                        gameState.alivePlayers.splice(index, 1);
                };
                setTimeout(() => {
                    if (gameState.alivePlayers.length === 1) {
                        const findWinner = gameState.players.find(obj => obj.index === gameState.alivePlayers[0]);
                        gameState.gameOver = true;
                        const gameOverMsg = {
                            action: "game over",
                            winner: findWinner,
                            gameState: gameState,
                        };
                        sendData(gameOverMsg);
                    } else if (gameState.alivePlayers.length === 0 && !gameState.gameOver) {
                        const copyPlayers = [...gameState.players];
                        copyPlayers.sort((a, b) => b.deathTime - a.deathTime)
                        for (let i = 0; i < copyPlayers.length; i++) {
                            if ((copyPlayers[0].deathTime - copyPlayers[i].deathTime) < 1000/60) {
                                gameState.players[copyPlayers[i].index - 1].lives = 1;
                                if (copyPlayers[i].index === 1) {
                                    gameState.players[copyPlayers[i].index - 1].yIndex = 3;
                                } else if (copyPlayers[i].index === 2){
                                    gameState.players[copyPlayers[i].index - 1].yIndex = 10;
                                } else if (copyPlayers[i].index === 3){
                                    gameState.players[copyPlayers[i].index - 1].yIndex = 13;
                                } else if (copyPlayers[i].index === 4){
                                    gameState.players[copyPlayers[i].index - 1].yIndex = 16;
                                };
                                gameState.players[copyPlayers[i].index - 1].loop = [5,4,5,6];
                                gameState.players[copyPlayers[i].index - 1].xIndex = 0;
                                gameState.players[copyPlayers[i].index - 1].manDied = false;
                                gameState.players[copyPlayers[i].index - 1].bombRadius = 1;
                                gameState.players[copyPlayers[i].index - 1].bombLimit = 1;
                                gameState.players[copyPlayers[i].index - 1].movementSpeed =  0.0625;
                                gameState.players[copyPlayers[i].index - 1].opacity =  "1";
                                gameState.players[copyPlayers[i].index - 1].keys = [];
                                gameState.players[copyPlayers[i].index - 1].deathFrames = 0;
                                findEmpty(gameState.players[copyPlayers[i].index - 1]);
                                gameState.alivePlayers.push(copyPlayers[i].index);
                                const newUpdate = updatePlayerStats(copyPlayers[i], "gain life");
                                sendData(newUpdate);
                            };
                        };
                        sendData({gameState: gameState});
                    };
                }, 1000/60);
                gameState.players[player-1].manX = 0;
                gameState.players[player-1].manY = 0;
                gameState.players[player-1].opacity = "0";
            }
            sendData({gameState: gameState});
            clearInterval(deathTick);
        } else {
            if (gameState.players[player-1].xIndex < gameState.players[player-1].loop.length) {
                gameState.players[player-1].xIndex = gameState.players[player-1].xIndex + 1;
            }
            sendData({gameState: gameState});
        }
        gameState.players[player-1].deathFrames = gameState.players[player-1].deathFrames + 1;
    };
};
function checkDieded(player, sendData) {    //  function to check if bomberman has walked into the fire 
    const mensX = checkIfNextOrPrevBox(gameState.players[player-1].manX);
    const mensY = checkIfNextOrPrevBox(gameState.players[player-1].manY);
    for (let i = 61; i <= 102; i++) {
        if ((gameState.arena[mensY][mensX] === i && !gameState.players[player-1].immortal && !gameState.players[player-1].manDied)) {
            const deathTime = Date.now();
            gameState.players[player-1].deathTime = deathTime;
            deadMan(gameState.players[player-1].index, sendData);
            const newData = updatePlayerStats(gameState.players[player-1], "lost life");
            sendData(newData);
            break
        };
    };
};
function checkManPos(player, sendData) {  //  function to check bomberman position
    const mensX = checkIfNextOrPrevBox(gameState.players[player-1].manX);
    const mensY = checkIfNextOrPrevBox(gameState.players[player-1].manY);
    if (gameState.arena[mensY][mensX] === 2) {  //  .. or collected extra bomb powerup..
        const newData = updatePlayerStats(gameState.players[player-1], "increase bomb limit");
        sendData(newData);
    };
    if (gameState.arena[mensY][mensX] === 5) {  //  .. or collected movement speed powerup..
        const newData = updatePlayerStats(gameState.players[player-1], "increase movement speed");
        sendData(newData);
    };
    if (gameState.arena[mensY][mensX] === 18) { //  .. or collected bigger explosion powerup..
        const newData = updatePlayerStats(gameState.players[player-1], "increase bomb radius");
        sendData(newData);
    };
};
function checkCorner(a) {   //  function to round coordinates so you dont have to be pixel perfect to fit between blocks!
    let b = a % 1;
    if (b <= 0.25 && b > 0) {
        a = Math.floor(a);
    } else if (b >= 0.75 && b < 1) {
        a = Math.ceil(a);
    };
    return a;
};
function collide(player, x, y) { // function to check, if character is allowed to move where they want to move (if there is hard block or soft-wall, they are not allowed to)
    for (let i = 61; i <= 102; i++) {
        if (gameState.arena[y][x] === i && i !== 67 && i !== 73) {
            return false;
        };
    };
    for (let i = 0; i < powerDel.length; i++) {
        if (gameState.arena[y][x] === powerDel[i]) {
            return false;
        };
    };
    if (gameState.arena[y][x] === 1 || gameState.arena[y][x] == 2 || gameState.arena[y][x] == 5 || gameState.arena[y][x] == 18) {
        return false;
    } else if ((typeof gameState.arena[y][x] !== "number") && ((player.manX - x) < 0.5 && player.manX > x || (x - player.manX) < 0.5 && player.manX < x  || (player.manY - y) < 0.5 && player.manY > y || (y - player.manY) < 0.5 && player.manY < y)) {
        // check if you have just planted the bomb and if you have, you are allowed to move freely away from it (in 0.5x0.5 block radius)
        return false;
    } else {
        return true;
    };
};
function movementMan(playerID, sendData) {  //  function to read players inputs and moving character based on them
    function moveLeft(playerID) {   //  left arrow
        if(!gameState.players[playerID-1].keys.includes("up") && !gameState.players[playerID-1].keys.includes("down")) {
            gameState.players[playerID-1].manY = checkCorner(gameState.players[playerID-1].manY);
        };
        if(Number.isInteger(gameState.players[playerID-1].manY) && !collide(gameState.players[playerID-1], Math.floor(gameState.players[playerID-1].manX - gameState.players[playerID-1].movementSpeed), gameState.players[playerID-1].manY)) { 
            gameState.players[playerID-1].manX = gameState.players[playerID-1].manX - gameState.players[playerID-1].movementSpeed;
        };
        gameState.players[playerID-1].loop = [9,7,9,8];
        if (playerID === 1) {
            gameState.players[playerID-1].yIndex = 4;
        } else if (playerID === 2){
            gameState.players[playerID-1].yIndex = 11;
        } else if (playerID === 3){
            gameState.players[playerID-1].yIndex = 14;
        }else if (playerID === 4){
            gameState.players[playerID-1].yIndex = 17;
        };
    };
    function moveRight(playerID) {  //  right arrow
        if(!gameState.players[playerID-1].keys.includes("up") && !gameState.players[playerID-1].keys.includes("down")) {
            gameState.players[playerID-1].manY = checkCorner(gameState.players[playerID-1].manY);
        };
        if(Number.isInteger(gameState.players[playerID-1].manY) && !collide(gameState.players[playerID-1], Math.ceil(gameState.players[playerID-1].manX + gameState.players[playerID-1].movementSpeed), gameState.players[playerID-1].manY)) {
            gameState.players[playerID-1].manX = gameState.players[playerID-1].manX + gameState.players[playerID-1].movementSpeed;
        };
        gameState.players[playerID-1].loop = [9,7,9,8];
        if (playerID === 1) {
            gameState.players[playerID-1].yIndex = 3;
        } else if (playerID === 2){
            gameState.players[playerID-1].yIndex = 10;
        } else if (playerID === 3){
            gameState.players[playerID-1].yIndex = 13;
        } else if (playerID === 4){
            gameState.players[playerID-1].yIndex = 16;
        };
    };
    function moveUp(playerID) { //  up arrow key
        if(!gameState.players[playerID-1].keys.includes("left") && !gameState.players[playerID-1].keys.includes("right")) {
            gameState.players[playerID-1].manX = checkCorner(gameState.players[playerID-1].manX);
        };
        if(Number.isInteger(gameState.players[playerID-1].manX) && !collide(gameState.players[playerID-1], gameState.players[playerID-1].manX, Math.floor(gameState.players[playerID-1].manY - gameState.players[playerID-1].movementSpeed))) {
            gameState.players[playerID-1].manY -= gameState.players[playerID-1].movementSpeed;
        };
        gameState.players[playerID-1].loop = [5,4,5,6];
        if (playerID === 1) {
            gameState.players[playerID-1].yIndex = 4;
        } else if (playerID === 2){
            gameState.players[playerID-1].yIndex = 11;
        } else if (playerID === 3){
            gameState.players[playerID-1].yIndex = 14;
        } else if (playerID === 4){
            gameState.players[playerID-1].yIndex = 17;
        };
    };
    function moveDown(playerID) {   //  down arrow key
        if(!gameState.players[playerID-1].keys.includes("left") && !gameState.players[playerID-1].keys.includes("right")) {
            gameState.players[playerID-1].manX = checkCorner(gameState.players[playerID-1].manX);
        };
        if(Number.isInteger(gameState.players[playerID-1].manX) && !collide(gameState.players[playerID-1], gameState.players[playerID-1].manX, Math.ceil(gameState.players[playerID-1].manY + gameState.players[playerID-1].movementSpeed))) {
            gameState.players[playerID-1].manY += gameState.players[playerID-1].movementSpeed;
        };
        gameState.players[playerID-1].loop = [5,4,5,6];
        if (playerID === 1) {
            gameState.players[playerID-1].yIndex = 3;
        } else if (playerID === 2){
            gameState.players[playerID-1].yIndex = 10;
        } else if (playerID === 3){
            gameState.players[playerID-1].yIndex = 13;
        } else if (playerID === 4){
            gameState.players[playerID-1].yIndex = 16;
        };
    };
    if (gameState.players[playerID-1].isMoving) {
        if (gameState.players[playerID-1].immortal) {
            gameState.players[playerID-1].immortalTimeIndex = 25;
        };
        let move;
        if (gameState.players[playerID-1].startMoving) {
            gameState.players[playerID-1].startMoving = false;
            move = setInterval(moving, 1000/60);
        };
        function moving() {
            gameState.players[playerID-1].moveFrames = gameState.players[playerID-1].moveFrames + 1;
            if (gameState.players[playerID-1].moveFrames >= 12) {
                gameState.players[playerID-1].moveFrames = 0;
                gameState.players[playerID-1].xIndex += 1;
                if (gameState.players[playerID-1].xIndex > 3) {
                    gameState.players[playerID-1].xIndex = 0;
                };
            };
            if (gameState.players[playerID-1].keys.includes("right")) {
                moveRight(playerID);
            };
            if (gameState.players[playerID-1].keys.includes("left")) {
                moveLeft(playerID);
            };
            if (gameState.players[playerID-1].keys.includes("up")) {
                moveUp(playerID);
            };
            if (gameState.players[playerID-1].keys.includes("down")) {
                moveDown(playerID);
            };
            checkManPos(playerID, sendData);
            if (gameState.players[playerID-1].stopMoving || gameState.players[playerID-1].manDied) {
                gameState.players[playerID-1].isMoving = false;
                gameState.players[playerID-1].moveFrames = 0;
                gameState.players[playerID-1].xIndex = 0;
                sendData({gameState: gameState});
                clearInterval(move);
            };
            sendData({gameState: gameState});
        };
    };
};
function immortalityHandler(player, sendData) {
    gameState.players[player-1].immortal = true
    let immortality = setInterval(immortalTime, 200);
    function immortalTime() {
        if (gameState.players[player-1].immortalTimeIndex >= 25) {
            gameState.players[player-1].immortalTimeIndex = 0
            gameState.players[player-1].immortalIndex = 0
            gameState.players[player-1].opacity = "1"
            gameState.players[player-1].immortal = false
            sendData({gameState: gameState});
            clearInterval(immortality)
        } else {
            gameState.players[player-1].immortalIndex = gameState.players[player-1].immortalIndex + 1
            if (gameState.players[player-1].immortalIndex > 2) {
                gameState.players[player-1].immortalIndex = 0
            }
            gameState.players[player-1].opacity = immortalOpacity[gameState.players[player-1].immortalIndex]
            sendData({gameState: gameState});
        }
        gameState.players[player-1].immortalTimeIndex = gameState.players[player-1].immortalTimeIndex + 1
    }
}
function bombaHandler(bomb, sendData) {
    if (gameState.players[bomb.owner-1].immortal) {
        gameState.players[bomb.owner-1].immortalTimeIndex = 25
    }
    if (gameState.arena[bomb.y][bomb.x] === 1) {
        gameState.players[bomb.owner-1].bombs.push(bomb);
        sendData({gameState: gameState});
        let bombTick = setInterval(bombTime, 100);
        function bombTime() {
            if (bomb.bombTimeIndex === 30) {
                clearArena();
                sendData({gameState: gameState});
                clearInterval(bombTick);
            } else if (bomb.bombTimeIndex < 20) {
                gameState.arena[bomb.y][bomb.x] =  [bomb.owner, bomb.bombTimeIndex];
                sendData({gameState: gameState});
            } else if (bomb.bombTimeIndex >= 20) {
                if (bomb.bombTimeIndex === 20) {
                    gameState.players[bomb.owner-1].bombs.splice(bomb, 1);
                };
                checkIfSoftwall(bomb, sendData);
                bomb.explosionIndex = bomb.explosionIndex + 1;
                sendData({gameState: gameState});
            }
            bomb.bombTimeIndex = bomb.bombTimeIndex + 1;
        };
    }
};
function checkIfSoftwall(bomb, sendData) {    //    function for bomb (check what kind squares are next to bomb and make according animations for it)
    for (let i = 0; i < gameState.alivePlayers.length; i++) {
        checkDieded(gameState.alivePlayers[i], sendData);
    };
    gameState.arena[bomb.y][bomb.x] = explosionCenter[bomb.explosionIndex];
    checkingUp(bomb);
    checkingDown(bomb);
    checkingLeft(bomb);
    checkingRight(bomb);
};
function createArena() {    //  function to create 15x13 bomberman arena based on basemap
    for (let y = 0; y < 13; y++) {
        gameState.arena[y] = [];
        for (let x = 0; x < 15; x++) {
            if (!gameState.baseMap[y][x] && Math.random() < 0.9 && gameState.baseMap[y][x] !== 0) {
                gameState.arena[y][x] = 16;
            } else if (!gameState.baseMap[y][x]){
                gameState.arena[y][x] = 1;
            } else {
                gameState.arena[y][x] = gameState.baseMap[y][x];
            };
        };
    };
};
function makePowerups(players) {   //    creates brick wall array that we later use for making powerups that come out behind the wall
    let index = 0;
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 15; x++) {            
            if (gameState.arena[y][x] == 16) {               
            gameState.softwalls.push(index);
            }
            index++;
        };
    };
    for (let i = 0; i < players*3; i++) {
        const bombIndex = Math.floor(Math.random() * gameState.softwalls.length);
        if (!gameState.extraBombs.includes(gameState.softwalls[bombIndex])){
            gameState.extraBombs.push(gameState.softwalls[bombIndex]);
        };
        gameState.softwalls.splice(bombIndex, 1);
    };
    for (let i = 0; i < players*3; i++) {
        const bombIndex = Math.floor(Math.random() * gameState.softwalls.length);
        if (!gameState.fasterSpeed.includes(gameState.softwalls[bombIndex])){
            gameState.fasterSpeed.push(gameState.softwalls[bombIndex]);
        };
        gameState.softwalls.splice(bombIndex, 1);
    }
    for (let i = 0; i < players*3; i++) {
        const bombIndex = Math.floor(Math.random() * gameState.softwalls.length);
        if (!gameState.biggerBombs.includes(gameState.softwalls[bombIndex])){
            gameState.biggerBombs.push(gameState.softwalls[bombIndex]);
        };
        gameState.softwalls.splice(bombIndex, 1);
    };
};
function findBomb(x, y, dir) {  //  finding a bomb in arena
    let isBomb = false;
    if (typeof gameState.arena[y][x] !== "number") {
        isBomb = true;
        for (let i = 0; i < gameState.bombs.length; i++) {
            if (gameState.bombs[i].x === x && gameState.bombs[i].y === y) {
                gameState.bombs[i].bombTimeIndex = 20;
                gameState.bombs[i].bombToBomb = dir;
            };
        };
    };
    return isBomb;
};
function checkingUp(bomb) { // checking if there is another bomb on explosion direction that needs to be blown up
    for (let i = 1; i <= bomb.radius; i++) {
        if (bomb.bombToBomb === "up") {
            break
        };
        if (gameState.arena[bomb.y-i][bomb.x] === 17) {
            break
        };
        const isBomb = findBomb(bomb.x, bomb.y-i, "down");
        if (isBomb) {
            break
        };
        if (gameState.arena[bomb.y-i][bomb.x] === 1 && i !== bomb.radius || (explosionAddon.includes(gameState.arena[bomb.y-i][bomb.x]) && gameState.arena[bomb.y-i][bomb.x] !== 1)) {
            gameState.arena[bomb.y-i][bomb.x] = explosionAddon[bomb.explosionIndex];
            continue
        } ;
        if (gameState.arena[bomb.y-i][bomb.x] === 1 && i === bomb.radius || explosionUp.includes(gameState.arena[bomb.y-i][bomb.x])) {
            gameState.arena[bomb.y-i][bomb.x] = explosionUp[bomb.explosionIndex];
            continue
        };
        if (gameState.arena[bomb.y-i][bomb.x] === 2 || gameState.arena[bomb.y-i][bomb.x] === 5 || gameState.arena[bomb.y-i][bomb.x] === 18 || powerDel.includes( gameState.arena[bomb.y-i][bomb.x])) { //up
            gameState.arena[bomb.y-i][bomb.x] = powerDel[bomb.explosionIndex];
        } else if (explosionUp.includes( gameState.arena[bomb.y-i][bomb.x])) {
            gameState.arena[bomb.y-i][bomb.x] = explosionUp[bomb.explosionIndex];
        };
        if (gameState.arena[bomb.y-i][bomb.x] === 16) { //up
            gameState.arena[bomb.y-i][bomb.x] = brickDel[bomb.explosionIndex];
            break
        } else if (brickDel.includes(gameState.arena[bomb.y-i][bomb.x])) {
            gameState.arena[bomb.y-i][bomb.x] = brickDel[bomb.explosionIndex];
            break
        };
    };
};
function checkingDown(bomb) {
    for (let i = 1; i <= bomb.radius; i++) {
        if (bomb.bombToBomb === "down") {
            break
        };
        if (gameState.arena[bomb.y+i][bomb.x] === 17) {
            break
        };
        const isBomb = findBomb(bomb.x, bomb.y+i, "up");
        if (isBomb) {
            break
        };
        if (gameState.arena[bomb.y+i][bomb.x] === 1 && i !== bomb.radius || (explosionAddon.includes(gameState.arena[bomb.y+i][bomb.x]) && gameState.arena[bomb.y+i][bomb.x] !== 1)) {
            gameState.arena[bomb.y+i][bomb.x] = explosionAddon[bomb.explosionIndex];
            continue
        };
        if (gameState.arena[bomb.y+i][bomb.x] === 1 && i === bomb.radius || explosionDown.includes(gameState.arena[bomb.y+i][bomb.x])) {
            gameState.arena[bomb.y+i][bomb.x] = explosionDown[bomb.explosionIndex];
            continue
        };
        if ( gameState.arena[bomb.y+i][bomb.x] === 2 || gameState.arena[bomb.y+i][bomb.x] === 5 || gameState.arena[bomb.y+i][bomb.x] === 18 || powerDel.includes( gameState.arena[bomb.y+i][bomb.x])) { //down
            gameState.arena[bomb.y+i][bomb.x] = powerDel[bomb.explosionIndex];
        } else if (explosionDown.includes( gameState.arena[bomb.y+i][bomb.x])) {
            gameState.arena[bomb.y+i][bomb.x] = explosionDown[bomb.explosionIndex];
        };
        if (gameState.arena[bomb.y+i][bomb.x] === 16) { //down
            gameState.arena[bomb.y+i][bomb.x] = brickDel[bomb.explosionIndex];
            break
        } else if (brickDel.includes(gameState.arena[bomb.y+i][bomb.x])) {
            gameState.arena[bomb.y+i][bomb.x] = brickDel[bomb.explosionIndex];
            break
        };
    };
};
function checkingLeft(bomb) {
    for (let i = 1; i <= bomb.radius; i++) {
        if (bomb.bombToBomb === "left") {
            break
        };
        if (gameState.arena[bomb.y][bomb.x-i] === 17) {
            break
        };
        const isBomb = findBomb(bomb.x-i, bomb.y, "right");
        if (isBomb) {
            break
        };
        if (gameState.arena[bomb.y][bomb.x-i] === 1 && i !== bomb.radius || (explosionSideAddon.includes(gameState.arena[bomb.y][bomb.x-i]) && gameState.arena[bomb.y][bomb.x-i] !== 1)) {
            gameState.arena[bomb.y][bomb.x-i] = explosionSideAddon[bomb.explosionIndex];
            continue
        };
        if (gameState.arena[bomb.y][bomb.x-i] === 1 && i === bomb.radius || explosionLeft.includes(gameState.arena[bomb.y][bomb.x-i])) {
            gameState.arena[bomb.y][bomb.x-i] = explosionLeft[bomb.explosionIndex];
            continue
        };
        if ( gameState.arena[bomb.y][bomb.x-i] === 2 || gameState.arena[bomb.y][bomb.x-i] === 5 || gameState.arena[bomb.y][bomb.x-i] === 18 ||  powerDel.includes( gameState.arena[bomb.y][bomb.x-i])) { //left
            gameState.arena[bomb.y][bomb.x-i] = powerDel[bomb.explosionIndex];
        } else if (explosionLeft.includes( gameState.arena[bomb.y][bomb.x-i])) {
             gameState.arena[bomb.y][bomb.x-i] = explosionLeft[bomb.explosionIndex];
        };
        if (gameState.arena[bomb.y][bomb.x-i] === 16) { //left
            gameState.arena[bomb.y][bomb.x-i] = brickDel[bomb.explosionIndex];
            break
        } else if (brickDel.includes(gameState.arena[bomb.y][bomb.x-i])) {
            gameState.arena[bomb.y][bomb.x-i] = brickDel[bomb.explosionIndex];
            break
        };
    };
};
function checkingRight(bomb) {
    for (let i = 1; i <= bomb.radius; i++) {
        if (bomb.bombToBomb === "right") {
            break
        };
        if (gameState.arena[bomb.y][bomb.x+i] === 17) {
            break
        };
        const isBomb = findBomb(bomb.x+i, bomb.y, "left");
        if (isBomb) {
            break
        };
        if (gameState.arena[bomb.y][bomb.x+i] === 1 && i !== bomb.radius || (explosionSideAddon.includes(gameState.arena[bomb.y][bomb.x+i]) && gameState.arena[bomb.y][bomb.x+i] !== 1)) {
            gameState.arena[bomb.y][bomb.x+i] = explosionSideAddon[bomb.explosionIndex];
            continue
        };
        if (gameState.arena[bomb.y][bomb.x+i] === 1 && i === bomb.radius || explosionRight.includes(gameState.arena[bomb.y][bomb.x+i])) {
            gameState.arena[bomb.y][bomb.x+i] = explosionRight[bomb.explosionIndex];
            continue
        };
        if ( gameState.arena[bomb.y][bomb.x+i] === 2 || gameState.arena[bomb.y][bomb.x+i] === 5 || gameState.arena[bomb.y][bomb.x+i] === 18 || powerDel.includes( gameState.arena[bomb.y][bomb.x+i])) { //right
            gameState.arena[bomb.y][bomb.x+i] = powerDel[bomb.explosionIndex];
        } else if (explosionRight.includes( gameState.arena[bomb.y][bomb.x+i])) {
            gameState.arena[bomb.y][bomb.x+i] = explosionRight[bomb.explosionIndex];
        };
        if (gameState.arena[bomb.y][bomb.x+i] === 16) { //right
            gameState.arena[bomb.y][bomb.x+i] = brickDel[bomb.explosionIndex];
            break
        } else if (brickDel.includes(gameState.arena[bomb.y][bomb.x+i])) {
            gameState.arena[bomb.y][bomb.x+i] = brickDel[bomb.explosionIndex];
            break
        };
    };
};
function clearArena() { //  function for clearing bombs from arena after explosion
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 15; x++) {
            for (let i = 0; i < gameState.extraBombs.length; i++) {
                if (gameState.arena[y][x] === 6 && y === Math.floor(gameState.extraBombs[i]/15) && x === (gameState.extraBombs[i]%15)) {
                    gameState.arena[y][x] = 2;
                };
            };
            for (let i = 0; i < gameState.fasterSpeed.length; i++) {
                if (gameState.arena[y][x] === 6 && y === Math.floor(gameState.fasterSpeed[i]/15) && x === (gameState.fasterSpeed[i]%15)) {
                    gameState.arena[y][x] = 5;
                };
            };
            for (let i = 0; i < gameState.biggerBombs.length; i++) {
                if (gameState.arena[y][x] === 6 && y === Math.floor(gameState.biggerBombs[i]/15) && x === (gameState.biggerBombs[i]%15)) {
                    gameState.arena[y][x] = 18;
                };
            };
            if (gameState.arena[y][x] === 6 || gameState.arena[y][x] === 97){
                gameState.arena[y][x] = 1;
            };
        };
    };
};
function updatePlayerStats(findPlayer, action) {    //  updates player lives and power-up levels
    let restart = false;
    const statChanges = {
      "lost life": { lives: findPlayer.lives - 1, manDied: true, bombLimit: 1, bombRadius: 1, movementSpeed: 0.0625 },
      "gain life": { lives: 1, manDied: false, bombLimit: 3, bombRadius: 3, movementSpeed: 0.09375 },
      "increase bomb limit": { bombLimit: findPlayer.bombLimit + 1 },
      "increase bomb radius": { bombRadius: findPlayer.bombRadius + 1 },
      "increase movement speed": { movementSpeed: findPlayer.movementSpeed + 0.015625 }
    };
    if (statChanges[action]) {
        if (action !== "lost life" && action !== "gain life") {   //  clear arena box after power-up is picked up
            const mensX = checkIfNextOrPrevBox(findPlayer.manX);
            const mensY = checkIfNextOrPrevBox(findPlayer.manY);
            gameState.arena[mensY][mensX] = 1;
        };
        if (action === "gain life") {
            restart = true
        }
        Object.assign(findPlayer, statChanges[action]);
        const newMessage = {
            action: "player stats changed",
            restart: restart,
            playerID: findPlayer.index,
            gameState: gameState,
        };
        return newMessage
    };
};

module.exports = {
    gameState,
    makePlayer,
    bombaHandler,
    createArena,
    makePowerups,
    movementMan,
};