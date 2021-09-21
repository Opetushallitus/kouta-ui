import { getOpintojenLaajuusTranslations } from './getOpintojenLaajuusTranslations';

test('getOpintojenLaajuusTranslations should give translations for TUVA laajuus', () => {
  const laajuusyksikotFromKoodisto = [
    {
      nimi: 'kompetenspoäng',
      kuvaus: 'kompetenspoäng',
      lyhytNimi: 'kp',
      kieli: 'SV',
    },
    {
      nimi: 'osaamispistettä',
      kuvaus: 'osaamispistettä',
      kieli: 'FI',
    },
    {
      nimi: 'ECVET competence points',
      kuvaus: 'competence points',
      lyhytNimi: 'competence points',
      kieli: 'EN',
    },
  ];

  const laajuudetFromKoodisto = [
    {
      nimi: '38 viikkoa',
      kieli: 'FI',
    },
    {
      nimi: '38 veckor',
      kieli: 'SV',
    },
    {
      nimi: '38 weeks',
      kieli: 'EN',
    },
  ];

  const translations = {
    fi: '38 viikkoa',
    sv: '38 veckor',
    en: '38 weeks',
  };

  expect(
    getOpintojenLaajuusTranslations(
      laajuudetFromKoodisto,
      laajuusyksikotFromKoodisto
    )
  ).toEqual(translations);
});

test('getOpintojenLaajuusTranslations should form translations from laajuus and laajuusyksikko for TELMA', () => {
  const laajuudetFromKoodisto = [
    {
      nimi: '60',
      kieli: 'FI',
    },
  ];

  const laajuusyksikotFromKoodisto = [
    {
      nimi: 'kompetenspoäng',
      kuvaus: 'kompetenspoäng',
      lyhytNimi: 'kp',
      kieli: 'SV',
    },
    {
      nimi: 'osaamispistettä',
      kuvaus: 'osaamispistettä',
      kieli: 'FI',
    },
    {
      nimi: 'ECVET competence points',
      kuvaus: 'competence points',
      lyhytNimi: 'competence points',
      kieli: 'EN',
    },
  ];

  const translations = {
    fi: '60 osaamispistettä',
    sv: '60 kompetenspoäng',
    en: '60 ECVET competence points',
  };

  expect(
    getOpintojenLaajuusTranslations(
      laajuudetFromKoodisto,
      laajuusyksikotFromKoodisto
    )
  ).toEqual(translations);
});
