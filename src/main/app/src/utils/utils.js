const snake = require('to-snake-case');

export const getCssClassName = (component) => snake(component.constructor.name).replace(/_/g, '-');