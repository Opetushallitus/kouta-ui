import {getItem, setItem, enforceItem, } from './storageUtils';
import {clone, safeClone, enforceObject, getValueOrClone} from './objectUtils'

const connectionMap = {};
let listenerId = 0;

export const observe = (eventName, item) => setItem(eventName, clone(item));

export const updateState = (eventName, newState) => {
  let targetItem = enforceItem(eventName) || {};
  newState = enforceObject(newState);
  targetItem = Object.assign(targetItem, newState);
  setItem(eventName, targetItem);
  broadcast(eventName, targetItem);
  return safeClone(targetItem);
}

export const containsValue = (eventName, property) => (getItem(eventName) || {})[property];

export const getState = (eventName, property) => {
  const state = enforceItem(eventName);
  return state ? state['_value'] || safeClone(property ? state[property] : state) : null;
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
export const connectToOne = (eventName, listener, targetFunction) => {
  const listenerId = enforceListenerId(listener);
  connectionMap[eventName] = connectionMap[eventName] || {};
  connectionMap[eventName][listenerId.toString()] = targetFunction;
  const dataItem = getItem(eventName);
  if (dataItem) {
    broadcast(eventName, dataItem);
  }
}

export const connectToMany = (eventList, listener, targetFunction) =>
    eventList.forEach(eventName => connectToOne(eventName, listener, targetFunction));

export const setState = (stateName, newState) => {
  newState = enforceObject(newState);
  setItem(stateName, newState);
  broadcast(stateName, newState);
  return safeClone(newState);
};

export const clearState = (stateName) => setState(stateName, {});

export const clearValues = (stateName) => {
  const state = getItem(stateName);
  Object.keys(state).forEach(key => state[key] = null);
  return setState(stateName, state);
}

//A simple callback mechanism to achieve what MobX can't do: 1) pass change when value is changed inside a nested object, and 2) work with inheritance
export const broadcast = (eventName, item) => Object.values(connectionMap[eventName] || {}).forEach((listener) => listener(getValueOrClone(item)));
