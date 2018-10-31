import {LANGUAGE} from '../config/constants';

export const extractKoulutuksenKuvaus = (jsonData) =>
    ((k) => k.data || [])(jsonData)
    .slice(0, 1)
    .map((entry) => entry.kuvaus && entry.kuvaus[LANGUAGE.toLowerCase()]).join('');
