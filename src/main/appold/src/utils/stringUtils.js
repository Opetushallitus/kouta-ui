const snake = require('to-snake-case');

export const toCssCase = (string) => snake(string).replace(/_/g, '-');