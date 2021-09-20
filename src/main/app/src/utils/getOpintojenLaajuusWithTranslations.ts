import _ from 'lodash';

import { LANGUAGES } from '#/src/constants';

export const getOpintojenLaajuusWithTranslations = (
  laajuudetFromKoodisto,
  laajuusYksikotFromKoodisto
) => {
  const translations = {};
  const defaultLanguage = 'FI';
  if (laajuudetFromKoodisto && laajuusYksikotFromKoodisto) {
    _.forEach(LANGUAGES, language => {
      const lang = language.toUpperCase();
      const foundKieli = _.find(laajuudetFromKoodisto, ['kieli', lang]);

      let laajuudenNimi = foundKieli
        ? foundKieli.nimi
        : _.find(laajuudetFromKoodisto, ['kieli', defaultLanguage]).nimi;

      const includesYksikko = /\D+/.test(laajuudenNimi);
      let yksikko = '';
      if (!includesYksikko) {
        yksikko = ` ${
          _.find(laajuusYksikotFromKoodisto, ['kieli', lang]).nimi
        }`;
      }

      return (translations[language] = `${laajuudenNimi}${yksikko}`);
    });
  }
  return translations;
};
