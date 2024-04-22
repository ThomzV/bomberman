import { createElement } from "../framework/elements.js";
import { findLevel } from "../frontendUtils.js";

function heart(player) {
    let hearts = [];
    for (let i = 0; i < player.lives; i++) {
        const heart = createElement({
            type: "div",
            attributes: {
                class: "heart",
            }
        })
        hearts.push(heart)
    }
    return hearts
}
export function playerCard(player) {
    const frameX = player.lives === 0 ? player.defaultDeadFrameX : player.defaultFrameX;
    const frameY = player.lives === 0 ? player.defaultDeadFrameY : player.defaultFrameY;
    const playerImg = createElement({
        type: "div",
        attributes: {
            id: "player-img",
            style: `
                height: 32px;
                width: 16px;
                background-image: url("frontend/static/images/characters5.png");
                background-position: ${frameX * 16}px ${frameY * 32 - 16}px;
                transform: scale(3);
                transform-origin: top right;
            `
        }
    });
    const playerNickname = createElement({
        type: "span",
        attributes: {
            class: "player-nickname",
            id: "player-nickname",
        }
    });
    playerNickname.innerHTML = `${player.nickname}`;
    const lives = createElement({
        type: "span",
    });
    lives.innerHTML = "LIVES:";
    const hearts = heart(player);
    const playerLives = createElement({
        type: "div",
        attributes: {
            class: "player-lives",
            id: "player-lives",
        },
        children: [lives, ...hearts],
    });
    const powerupBomb = createElement({
        type: "div",
        attributes: {
            class: "powerup-bomb",
        }
    });
    const powerupLevel1 = createElement({
        type: "span",
        attributes: {
            class: "powerup-level",
            id: "bomb-level",
        }
    });
    powerupLevel1.innerHTML = `${player.bombLimit}`;
    const powerupFire = createElement({
        type: "div",
        attributes: {
            class: "powerup-fire",
        }
    });
    const powerupLevel2 = createElement({
        type: "span",
        attributes: {
            class: "powerup-level",
            id: "fire-level",
        }
    });
    powerupLevel2.innerHTML = `${player.bombRadius}`;
    const powerupSpeed = createElement({
        type: "div",
        attributes: {
            class: "powerup-speed",
        }
    });
    const powerupLevel3 = createElement({
        type: "span",
        attributes: {
            class: "powerup-level",
            id: "speed-level",
        }
    });
    powerupLevel3.innerHTML = findLevel(player.movementSpeed);
    const playerPowerup1 = createElement({
        type: "div",
        attributes: {
            class: "player-powerup",
        },
        children: [powerupBomb, powerupLevel1],
    });
    const playerPowerup2 = createElement({
        type: "div",
        attributes: {
            class: "player-powerup",
        },
        children: [powerupFire, powerupLevel2],
    });
    const playerPowerup3 = createElement({
        type: "div",
        attributes: {
            class: "player-powerup",
        },
        children: [powerupSpeed, powerupLevel3],
    });
    const playerPowerupsCont = createElement({
        type: "div",
        attributes: {
            class: "player-powerups-container",
        },
        children: [playerPowerup1, playerPowerup2, playerPowerup3]
    });
    const playerInfo = createElement({
        type: "div",
        attributes: {
            class: "player-info",
            id: "player-info",
        },
        children: [playerNickname, playerLives, playerPowerupsCont],
    });
    const cross = createElement({
        type: "div",
        attributes: {
            class: "cross",
            id: "cross",
            style: `display: ${player.lives === 0 ? "block" : "none"}`,
        },
    });
    const playerCard = createElement({
        type: "div",
        attributes: {
            class: "player-card",
            id: `player-card-${player.index}`, 
        },
        children: [cross, playerInfo, playerImg],
    });
    return playerCard
};
