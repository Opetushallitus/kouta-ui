import { updateOptionsWithMaybeDeprecatedOsaamismerkki } from './OsaamismerkkiField';

describe('updateOptionsWithMaybeDeprecatedOsaamismerkki', () => {
  test('should return new options array with deprecated osaamismerkki value and label', () => {
    const options = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
    ];

    const osaamismerkki = {
      id: 9202930,
      koodiUri: 'osaamismerkit_1011',
      nimi: {
        _id: '9204039',
        _tunniste: '19734f54-f4b4-43a6-ba0b-27d150463736',
        fi: 'Mittayksiköt',
        sv: 'Måttenheter',
      },
      voimassaoloAlkaa: 1704060000000,
      voimassaoloLoppuu: 1727643600000,
    };

    const result = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
      {
        value: 'osaamismerkit_1011#1',
        label: 'Mittayksiköt',
      },
    ];

    expect(
      updateOptionsWithMaybeDeprecatedOsaamismerkki(
        options,
        'osaamismerkit_1011#1',
        osaamismerkki,
        'fi'
      )
    ).toEqual(result);
  });

  test('should not update options if osaamismerkkiId is not defined', () => {
    const options = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
    ];

    const osaamismerkki = undefined;

    const result = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
    ];

    expect(
      updateOptionsWithMaybeDeprecatedOsaamismerkki(
        options,
        undefined,
        osaamismerkki,
        'fi'
      )
    ).toEqual(result);
  });

  test('should not update options if osaamismerkin nimi is not defined', () => {
    const options = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
    ];

    const result = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
    ];

    expect(
      updateOptionsWithMaybeDeprecatedOsaamismerkki(
        options,
        'osaamismerkit_1011#1',
        undefined,
        'fi'
      )
    ).toEqual(result);
  });

  test('should not update options if osaamismerkki already exists in options', () => {
    const options = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
      {
        value: 'osaamismerkit_1011#1',
        label: 'Mittayksiköt',
      },
    ];

    const osaamismerkki = {
      id: 9202930,
      koodiUri: 'osaamismerkit_1011',
      nimi: {
        _id: '9204039',
        _tunniste: '19734f54-f4b4-43a6-ba0b-27d150463736',
        fi: 'Mittayksiköt',
        sv: 'Måttenheter',
      },
      voimassaoloAlkaa: 1704060000000,
      voimassaoloLoppuu: 1727643600000,
    };

    const result = [
      {
        value: 'osaamismerkit_1009#1',
        label: 'Arjen rahankäyttö',
      },
      {
        value: 'osaamismerkit_1028#1',
        label: 'Digiosaamisen kehittäminen',
      },
      {
        value: 'osaamismerkit_1011#1',
        label: 'Mittayksiköt',
      },
    ];

    expect(
      updateOptionsWithMaybeDeprecatedOsaamismerkki(
        options,
        'osaamismerkit_1011#1',
        osaamismerkki,
        'fi'
      )
    ).toEqual(result);
  });
});
