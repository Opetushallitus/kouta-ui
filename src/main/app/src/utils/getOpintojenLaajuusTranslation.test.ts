import { getOpintojenLaajuusTranslation } from './getOpintojenLaajuusTranslation';

test('getOpintojenLaajuusTranslation should give translations for TUVA laajuus', () => {
  const laajuusyksikkoFromKoodisto = [
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

  const laajuusFromKoodisto = [
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

  expect(
    getOpintojenLaajuusTranslation(
      laajuusFromKoodisto,
      laajuusyksikkoFromKoodisto
    )
  ).toEqual('38 viikkoa');
});

test('getOpintojenLaajuusTranslation should form translations from laajuus and laajuusyksikko for TELMA', () => {
  const laajuudetFromKoodisto = [
    {
      nimi: '60',
      kieli: 'FI',
    },
    {
      nimi: '60',
      kieli: 'SV',
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

  const selectedLanguage = 'sv';

  expect(
    getOpintojenLaajuusTranslation(
      laajuudetFromKoodisto,
      laajuusyksikotFromKoodisto,
      selectedLanguage
    )
  ).toEqual('60 kompetenspoäng');
});

test('getOpintojenLaajuusTranslation should default to FI translation if selected language is missing', () => {
  const laajuusyksikkoFromKoodisto = [
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

  const laajuusFromKoodisto = [
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

  expect(
    getOpintojenLaajuusTranslation(
      laajuusFromKoodisto,
      laajuusyksikkoFromKoodisto
    )
  ).toEqual('38 viikkoa');
});

test('getOpintojenLaajuusTranslation should default to FI laajuus nimi if selected language nimi is missing', () => {
  const laajuusyksikkoFromKoodisto = [
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

  const laajuusFromKoodisto = [
    {
      nimi: '60',
      kieli: 'FI',
    },
  ];

  expect(
    getOpintojenLaajuusTranslation(
      laajuusFromKoodisto,
      laajuusyksikkoFromKoodisto,
      'en'
    )
  ).toEqual('60 ECVET competence points');
});

test('getOpintojenLaajuusTranslation should default to FI laajuus yksikko', () => {
  const laajuusyksikkoFromKoodisto = [
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
  ];

  const laajuusFromKoodisto = [
    {
      nimi: '60',
      kieli: 'FI',
    },
  ];

  expect(
    getOpintojenLaajuusTranslation(
      laajuusFromKoodisto,
      laajuusyksikkoFromKoodisto,
      'en'
    )
  ).toEqual('60 osaamispistettä');
});
