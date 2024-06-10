import { formValueExists } from '.';
import { getInvalidTranslations, getKielistettyOsoite } from './languageUtils';
import { createEmptyEditorState } from '../components/LexicalEditorUI/utils';

describe('getInvalidTranslations', () => {
  test.each([[{ fi: createEmptyEditorState() }, ['fi', 'sv'], []]])(
    'Should return empty array when optional and given empty editor state',
    (obj: any, languages: any, invalidTranslations: any) => {
      expect(
        getInvalidTranslations(obj, languages, formValueExists, true)
      ).toEqual(invalidTranslations);
    }
  );
});

describe('getKielistettyOsoite', () => {
  test('should return empty string if osoite is undefined', () => {
    const osoite = undefined;
    const koodi = undefined;
    const language = 'fi';
    expect(getKielistettyOsoite(osoite, koodi, language)).toEqual('');
  });

  test('should return osoite with katuosoite and postinumero in Finnish', () => {
    const osoite = {
      osoite: {
        fi: 'Hankalankuja 228',
      },
      postinumeroKoodiUri: { fi: 'posti_15110' },
    };
    const koodi = {
      koodiUri: 'posti_15110',
      koodiArvo: '15110',
      versio: 2,
      koodisto: {
        koodistoUri: 'posti',
      },
      metadata: [
        {
          nimi: 'LAHTI',
          kieli: 'SV',
        },
        {
          nimi: 'LAHTI',
          kieli: 'FI',
        },
      ],
      ylaRelaatiot: [],
    };
    const language = 'fi';
    expect(getKielistettyOsoite(osoite, koodi, language)).toEqual(
      'Hankalankuja 228, 15110 LAHTI'
    );
  });

  test('should return katuosoite if postinumerokoodi is undefined', () => {
    const osoite = {
      osoite: {
        fi: 'Hankalankuja 228',
      },
      postinumeroKoodiUri: { fi: 'posti_15110' },
    };
    const koodi = undefined;
    const language = 'fi';
    expect(getKielistettyOsoite(osoite, koodi, language)).toEqual(
      'Hankalankuja 228'
    );
  });

  test('should return Finnish osoite with katuosoite and postinumero when sv language address is not defined', () => {
    const osoite = {
      osoite: {
        fi: 'Hankalankuja 228',
      },
      postinumeroKoodiUri: { fi: 'posti_15110' },
    };
    const koodi = {
      koodiUri: 'posti_15110',
      koodiArvo: '15110',
      versio: 2,
      koodisto: {
        koodistoUri: 'posti',
      },
      metadata: [
        {
          nimi: 'LAHTI',
          kieli: 'SV',
        },
        {
          nimi: 'LAHTI',
          kieli: 'FI',
        },
      ],
      ylaRelaatiot: [],
    };
    const language = 'sv';
    expect(getKielistettyOsoite(osoite, koodi, language)).toEqual(
      'Hankalankuja 228, 15110 LAHTI'
    );
  });

  test('should choose English address over Swedish when fi language address is not defined', () => {
    const osoite = {
      osoite: {
        sv: 'Hankalavägen 228',
        en: 'Hankala street 229',
      },
      postinumeroKoodiUri: { sv: 'posti_15110', en: 'posti_15111' },
    };
    const koodi = {
      koodiUri: 'posti_15111',
      koodiArvo: '15111',
      versio: 2,
      koodisto: {
        koodistoUri: 'posti',
      },
      metadata: [
        {
          nimi: 'LAHTI',
          kieli: 'SV',
        },
        {
          nimi: 'LAHTI',
          kieli: 'FI',
        },
      ],
      ylaRelaatiot: [],
    };
    const language = 'fi';
    expect(getKielistettyOsoite(osoite, koodi, language)).toEqual(
      'Hankala street 229, 15111 LAHTI'
    );
  });
});
