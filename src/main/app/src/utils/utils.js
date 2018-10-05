const snake = require('to-snake-case');

export const getCssClassName = (component) => snake(component.constructor.name).replace(/_/g, '-');

const connectionMap = {};
const dataStore = {};
let listenerId = 0;

export const observe = (eventName, item) => dataStore[eventName] = clone(item);

export const updateState = (eventName, item) => {
  dataStore[eventName] = dataStore[eventName] || {};
  dataStore[eventName] = Object.assign(dataStore[eventName], item);
  broadcast(eventName, dataStore[eventName]);
}

// a simple function to couple a listener with matching event
export const connect = (eventName, listener, targetFunction) => {
  if (!listener._listenerId) {
    listenerId += 1;
    listener._listenerId = listenerId;
  }

  if (!connectionMap[eventName]) {
    connectionMap[eventName] = {};
  }
  const stringId = listenerId.toString();
  connectionMap[eventName][stringId] = targetFunction;
  const dataItem = dataStore[eventName];
  if (dataItem) {
    broadcast(eventName, clone(dataItem));
  }
};

const clone = (item) => {
  try {
    return JSON.parse(JSON.stringify(item));
  } catch(e) {
    return item;
  }
}

//A simple callback mechanism to achieve what MobX can't do: 1) pass change when value is changed inside a nested object, and work 2) with inheritance
export const broadcast = (eventName, item) => Object.values(connectionMap[eventName]).forEach((listener) => listener(clone(item)));



