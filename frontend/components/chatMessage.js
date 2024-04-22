import { createElement } from "../framework/elements.js";

export function chatMessage(message) {
    const msgTime = createElement({
        type: "span",
        attributes: {
            class: "msg-time", 
        },
    })
    msgTime.innerHTML = message.time;
    const msgSender = createElement({
        type: "span",
        attributes: {
            class: "msg-sender", 
        },
    })
    msgSender.innerHTML = `${message.sender}:`;
    const msgContent = createElement({
        type: "span",
        attributes: {
            class: "msg-content", 
        },
    })
    msgContent.innerHTML = message.content;
    const gameChatMsg = createElement({
        type: "div",
        attributes: {
            class: "game-chat-msg", 
        },
        children: [msgTime, msgSender, msgContent]
    })
    return gameChatMsg
};