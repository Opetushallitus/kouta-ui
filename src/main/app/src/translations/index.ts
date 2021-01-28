import _ from 'lodash';
import fi from './fi.json';
import sv from './sv.json';
import en from './en.json';

const translations = { fi, sv, en };

export const getTranslations = () =>
  _.mapValues(translations, trans => ({
    kouta: trans,
  }));

export default getTranslations;
