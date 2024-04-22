import { createElement } from "../framework/elements.js";

export function bombermanChar(player) {
    const frameX = player.loop[player.xIndex];
    const frameY = player.yIndex;
    const bomberman = createElement({
        type: "div",
        attributes: {
            id: player.index,
            style: `
                background-image: url("frontend/static/images/characters5.png");
                background-position: ${frameX * 16}px ${frameY * 32 - 16}px;
                height: 32px;
                width: 16px;
                margin-left: 0;
                margin-top: -16px;
                position: absolute;
                z-index: 100;
                transform: translate(${player.manX *16}px, ${player.manY *16}px);
            `,
        },
    });
    return bomberman;
};