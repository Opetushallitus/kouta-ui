import {LANGUAGE} from '../../config/constants';
import {TRANSLATIONS} from '../../config/translations';

export const LanguageStore = () => {};

export const getLanguage = () => LANGUAGE.toLowerCase();

export const tr = (entry) => TRANSLATIONS[entry][getLanguage()] || entry;
