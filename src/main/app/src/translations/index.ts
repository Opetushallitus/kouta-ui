import _ from 'lodash';

import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

const translations = { fi, sv, en };

export const getTranslations = () =>
  _.mapValues(translations, trans => ({
    kouta: trans,
  }));

export default getTranslations;
