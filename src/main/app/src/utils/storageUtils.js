import {parseJson} from './objectUtils';

export const getItem = (eventName) => parseJson(sessionStorage.getItem(eventName));

export const enforceItem = (eventName) => getItem(eventName) || null;

export const setItem = (eventName, item) => sessionStorage.setItem(eventName, JSON.stringify(item));

export const existsItem = (eventName) => sessionStorage.getItem(eventName) !== null;
