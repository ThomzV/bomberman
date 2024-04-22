import { createElement } from "../framework/elements.js";

export function arenaBlock(x, y) {
    const block = createElement({
        type: "div",
        attributes: {
            style: `
                background-image: url("frontend/static/images/characters5.png");
                background-position: ${x}px ${y}px;
                height: 16px;
                width: 16px;
                z-index: 1;
            `,
        },
    });
    return block;
};