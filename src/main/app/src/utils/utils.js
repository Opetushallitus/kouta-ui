const connectionMap = {};
let listenerId = 0;


const parseJson = (jsonString) => {
  if (!jsonString) {
    return null;
  }
  try {
    return JSON.parse(jsonString);
  } catch(e) {
    return null;
  }
}

const getItem = (eventName) => parseJson(localStorage.getItem(eventName));

const enforceItem = (eventName) => getItem(eventName) || {};

const setItem = (eventName, item) => localStorage.setItem(eventName, JSON.stringify(item));

export const observe = (eventName, item) => setItem(eventName, clone(item));

export const updateState = (eventName, item) => {
  let targetItem = enforceItem(eventName);
  targetItem = Object.assign(targetItem, item);
  setItem(eventName, targetItem);
  broadcast(eventName, targetItem);
  return safeClone(targetItem);
}

export const containsState = (eventName, property) => getItem(eventName) !== null;

export const getState = (eventName, property) => {
  const state = getItem(eventName);
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
  const dataItem = getItem(eventName);
  if (dataItem) {
    broadcast(eventName, dataItem);
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



