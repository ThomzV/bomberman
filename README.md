# Bomberman-DOM

This is a classic old school game called <strong>Bomberman</strong>. Choose a nickname and join the lobby. Use in-game chat to talk to fellow players. Up to 4 players can join the game and after at least 2 players have joined the lobby, game starts automatically. Plant bombs to destroy soft-walls and get upgrades or blow up other players. Last bomberman standing wins the game.

## Gameplay

### Controls

* use <strong>arrow keys</strong> to move
* use <strong>spacebar</strong> to plant the bomb

### Rules

* 2-4 players
* Player starts with 3 lives and level 1 on power-ups
* Players spawn on different corners of the map
* After death player loses 1 life and all the power-ups are reset back to level 1
* Last player to survive wins the game
* In case multiple players lose their last life at the same time a "Sudden death" will begin where players have 1 life and level 3 on power-ups

### Power-ups

* Bomb - increases the amount of bombs a player can plant at the same time by one
* Fire - increases the bomb explosion radius by one square
* Rollerskate - increases movement speed by quarter of a default speed

### Mechanics

* Bomb explosion can destroy soft-walls and visible power-ups
* After soft-wall is destroyed there is a possibility a random power-up will appear
* Only way to lose a life is to die in a bomb explosion
* After bomberman dies it becomes immortal for 5 seconds or until it moves/plants a bomb

## Project

This project is made using a custom javascript framework, websockets and node.js backend server. Components folder contains the main elements that are needed for the game. Inside a framework folder, there is a very simplified version of a framework. Static folder holds a CSS file and images. FrontendUtils.js provides helper functions for frontend. Index.html is used as a webpage default view. Setup.js handles websocket connection on browser, event listeners and webpage DOM changes. Game.js in frontend handles game logic in browser. BackendUtils.js provides helper functions for backend. Server.js sets up a node.js server, handles websocket connection on backend and joining game and starting logic. Game.js in backend handles game logic in server.

## Usage

* install dependencies <code>npm install</code>
* navigate to backend folder <code>cd backend/</code>
* start server <code>node server.js</code>
* visit [localhost:8080](http://localhost:8080)
* <strong>RECOMMENDED TO USE IT WITH GOOGLE CHROME!!!</strong>

## Audit

[audit questions](https://github.com/01-edu/public/tree/master/subjects/bomberman-dom/audit)

## Authors

- [@gkallo](https://01.kood.tech/git/gkallo)
- [@Thomas](https://01.kood.tech/git/Thomas)