import _ from 'lodash';

export const getOpintojenLaajuusTranslation = (
  laajuusFromKoodisto,
  laajuusyksikkoFromKoodisto,
  selectedLanguage
) => {
  let laajuusTranslation;
  const defaultLanguage = 'FI';
  const language = selectedLanguage
    ? selectedLanguage.toUpperCase()
    : defaultLanguage;

  if (laajuusFromKoodisto && laajuusyksikkoFromKoodisto) {
    let laajuus = _.find(laajuusFromKoodisto, {
      kieli: language,
    });

    if (_.isEmpty(laajuus)) {
      laajuus = _.find(laajuusFromKoodisto, {
        kieli: defaultLanguage,
      });
    }

    let yksikko = _.find(laajuusyksikkoFromKoodisto, {
      kieli: language,
    });

    if (_.isEmpty(yksikko)) {
      yksikko = _.find(laajuusyksikkoFromKoodisto, {
        kieli: defaultLanguage,
      });
    }

    if (laajuus.nimi && yksikko.nimi) {
      const includesYksikko = /[A-Za-z]+/.test(laajuus.nimi);
      laajuusTranslation = includesYksikko
        ? laajuus.nimi
        : `${laajuus.nimi} ${yksikko.nimi}`;
    }
  }
  return laajuusTranslation;
};
