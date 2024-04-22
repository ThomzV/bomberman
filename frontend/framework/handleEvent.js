export function handleEvent(element, eventType, handler) {
    if (!element) {
        console.error('Element does not exist');
        return;
    }
    element['on' + eventType] = handler;
};