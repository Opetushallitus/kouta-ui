import {parseJson} from './objectUtils';

export const getItem = (eventName) => parseJson(localStorage.getItem(eventName));

export const enforceItem = (eventName) => getItem(eventName) || null;

export const setItem = (eventName, item) => localStorage.setItem(eventName, JSON.stringify(item));