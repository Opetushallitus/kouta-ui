import _ from 'lodash';

import { LANGUAGES } from '#/src/constants';

export const getOpintojenLaajuusTranslations = (
  laajuudetFromKoodisto,
  laajuusyksikotFromKoodisto
) => {
  const translations = {};
  const defaultLanguage = 'FI';
  if (laajuudetFromKoodisto && laajuusyksikotFromKoodisto) {
    _.forEach(LANGUAGES, language => {
      const lang = language.toUpperCase();
      const foundKieli = _.find(laajuudetFromKoodisto, ['kieli', lang]);

      let laajuudenNimi = foundKieli
        ? foundKieli.nimi
        : _.find(laajuudetFromKoodisto, ['kieli', defaultLanguage]).nimi;

      const includesYksikko = /[A-Za-z]+/.test(laajuudenNimi);
      let yksikko = '';
      if (!includesYksikko) {
        yksikko = ` ${
          _.find(laajuusyksikotFromKoodisto, ['kieli', lang]).nimi
        }`;
      }

      return (translations[language] = `${laajuudenNimi}${yksikko}`);
    });
  }

  return translations;
};
