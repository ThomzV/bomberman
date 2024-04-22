import { playerCard } from "./components/playerCard.js";

export function findLevel(endSpeed) {
    const baseSpeed = 0.0625;
    const growthConst = 0.015625;
    const level = (endSpeed - baseSpeed) / growthConst + 1;
    return level;
};
export function createPlayerCards(players) {
    let playerCards = [];
    for (let i = 0; i < players.length; i++) {
        let newCard = playerCard(players[i])
        playerCards.push(newCard);
    };
    return playerCards;
};
