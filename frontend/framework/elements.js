export function createElement({
    type,
    value,
    attributes,
    children = [],
  }) {
    const element = document.createElement(type);
    if (value) {
        element.value = value
    }
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    if (children) {
        for (let i = 0; i < children.length; i++) {
            element.append(children[i])
        }
    }
    return element;
}