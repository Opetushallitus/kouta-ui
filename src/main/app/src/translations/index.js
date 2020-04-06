import _ from 'lodash';
import fi from './fi';
import sv from './sv';
import en from './en';

const translations = { fi, sv, en };

export const getTranslations = () =>
  _.mapValues(translations, trans => ({
    kouta: trans,
  }));

export default getTranslations;
