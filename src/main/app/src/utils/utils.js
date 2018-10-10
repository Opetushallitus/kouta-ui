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

export const getState = (eventName, property) => {
  const state = dataStore[eventName] || {};
  return safeClone(property ? state[property] : state);
}

//retrieves ID from listener and creates one if it does not exist yet
const enforceListenerId = (listener) => {
  if (!listener._listenerId) {
    listenerId += 1;
    listener._listenerId = listenerId.toString();
  }
  return listener._listenerId;
}

// a simple function to couple a listener with matching event
export const connect = (eventName, listener, targetFunction) => {
  const listenerId = enforceListenerId(listener);
  connectionMap[eventName] = connectionMap[eventName] || {};
  connectionMap[eventName][listenerId.toString()] = targetFunction;
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

const safeClone = (item) => item ? clone(item) : null;

//A simple callback mechanism to achieve what MobX can't do: 1) pass change when value is changed inside a nested object, and 2) work with inheritance
export const broadcast = (eventName, item) => Object.values(connectionMap[eventName] || {}).forEach((listener) => listener(clone(item)));



