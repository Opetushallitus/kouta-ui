import { TFunction } from 'i18next';

import { OSAAMISMERKKI_JULKAISUTILA } from '#/src/constants';

import {
  createKuvaus,
  createKuvausListElement,
} from './ToteutuksenKuvausSection';

const mockT = ((key: string) =>
  key === 'osaamismerkki.osaamistavoitteet'
    ? 'Osaamistavoitteet'
    : 'Arviointikriteerit') as TFunction;

describe('createKuvausListElement', () => {
  test('returns undefined if array is empty', () => {
    expect(
      createKuvausListElement([], 'Osaamistavoitteet', 'osaamistavoite', 'fi')
    ).toEqual('');
  });

  test('should create a list with one list item', () => {
    const listData = [
      {
        id: 9203215,
        osaamistavoite: {
          _id: '9204340',
          _tunniste: '785ea7f1-c1a9-4737-8c4f-4069e751a242',
          fi: 'osaa edistää omia digitaitojaan',
          sv: 'kan främja den egna digitala kompetensen',
        },
      },
    ];
    const result =
      '<h3>Osaamistavoitteet</h3><ul><li>osaa edistää omia digitaitojaan</li></ul>';
    expect(
      createKuvausListElement(
        listData,
        'Osaamistavoitteet',
        'osaamistavoite',
        'fi'
      )
    ).toEqual(result);
  });

  test('should create a list with several list items', () => {
    const listData = [
      {
        id: 9203254,
        arviointikriteeri: {
          _id: '9204325',
          _tunniste: '0cd49113-6936-4891-8eb0-c7f4de24f8a7',
          fi: 'nimeää kehittämisen kohteita omassa digiosaamisessaan',
          sv: 'ger exempel på utvecklingsbehov när det gäller den egna digitala kompetensen',
        },
      },
      {
        id: 9203255,
        arviointikriteeri: {
          _id: '9204326',
          _tunniste: '62a18d84-6e30-4702-9442-4ec0e2d69d19',
          fi: 'nimeää tiedon ja tuen lähteitä, joita voi käyttää oman osaamisensa edistämiseen',
          sv: 'ger exempel på olika stöd- och informationskällor som hen kan använda för att utveckla den egna kompetensen',
        },
      },
      {
        id: 9203256,
        arviointikriteeri: {
          _id: '9204327',
          _tunniste: '5f6fb391-c7ec-4007-9f32-46ecd4ddde26',
          fi: 'kokeilee itselle uusien digitaalisten ympäristöjen tai palveluiden käyttöä',
          sv: 'testar att använda digitala miljöer eller tjänster som är nya för hen',
        },
      },
    ];
    const result = `<h3>Arviointikriteerit</h3><ul><li>ger exempel på utvecklingsbehov när det gäller den egna digitala kompetensen</li><li>ger exempel på olika stöd- och informationskällor som hen kan använda för att utveckla den egna kompetensen</li><li>testar att använda digitala miljöer eller tjänster som är nya för hen</li></ul>`;
    expect(
      createKuvausListElement(
        listData,
        'Arviointikriteerit',
        'arviointikriteeri',
        'sv'
      )
    ).toEqual(result);
  });
});

describe('createKuvaus', () => {
  test('should return undefined if osaamismerkkiData is undefined', () => {
    const osaamismerkkiData = undefined;
    expect(createKuvaus('fi', mockT, osaamismerkkiData)).toEqual('');
  });

  test('should return a div with one list of osaamistavoitteet', () => {
    const osaamismerkkiData = {
      id: 9203137,
      nimi: {
        _id: '9204329',
        _tunniste: '6c1d7209-5636-40c1-929a-e584033b7e89',
        fi: 'Digiosaamisen kehittäminen',
        sv: 'Utveckling av den digitala kompetensen',
      },
      kuvaus: null,
      tila: OSAAMISMERKKI_JULKAISUTILA.JULKAISTU,
      kategoria: {
        id: 9202623,
        nimi: {
          _id: '9202528',
          _tunniste: '6d20f392-f411-4e85-9d00-559411a6e4d7',
          fi: 'Digitaidot',
          sv: 'Digital kompetens',
        },
        kuvaus: null,
        liite: {
          id: 'ff78de54-0090-484f-87ce-802ea6c70156',
          nimi: 'digitaidot_eitekstia.png',
          mime: 'image/png',
          binarydata: 'iVBORw0KG',
        },
        muokattu: 1707992127262,
      },
      koodiUri: 'osaamismerkit_1028',
      osaamistavoitteet: [
        {
          id: 9203215,
          osaamistavoite: {
            _id: '9204340',
            _tunniste: '785ea7f1-c1a9-4737-8c4f-4069e751a242',
            fi: 'osaa edistää omia digitaitojaan',
            sv: 'kan främja den egna digitala kompetensen',
          },
        },
      ],
      arviointikriteerit: [
        {
          id: 9203254,
          arviointikriteeri: {
            _id: '9204325',
            _tunniste: '0cd49113-6936-4891-8eb0-c7f4de24f8a7',
            fi: 'nimeää kehittämisen kohteita omassa digiosaamisessaan',
            sv: 'ger exempel på utvecklingsbehov när det gäller den egna digitala kompetensen',
          },
        },
        {
          id: 9203255,
          arviointikriteeri: {
            _id: '9204326',
            _tunniste: '62a18d84-6e30-4702-9442-4ec0e2d69d19',
            fi: 'nimeää tiedon ja tuen lähteitä, joita voi käyttää oman osaamisensa edistämiseen',
            sv: 'ger exempel på olika stöd- och informationskällor som hen kan använda för att utveckla den egna kompetensen',
          },
        },
        {
          id: 9203256,
          arviointikriteeri: {
            _id: '9204327',
            _tunniste: '5f6fb391-c7ec-4007-9f32-46ecd4ddde26',
            fi: 'kokeilee itselle uusien digitaalisten ympäristöjen tai palveluiden käyttöä',
            sv: 'testar att använda digitala miljöer eller tjänster som är nya för hen',
          },
        },
      ],
      voimassaoloAlkaa: 1704060000000,
      voimassaoloLoppuu: null,
      muokattu: 1706787471136,
      muokkaaja: '1.2.246.562.24.16945731101',
    };
    const result = `<h3>Osaamistavoitteet</h3><ul><li>kan främja den egna digitala kompetensen</li></ul><h3>Arviointikriteerit</h3><ul><li>ger exempel på utvecklingsbehov när det gäller den egna digitala kompetensen</li><li>ger exempel på olika stöd- och informationskällor som hen kan använda för att utveckla den egna kompetensen</li><li>testar att använda digitala miljöer eller tjänster som är nya för hen</li></ul>`;
    expect(createKuvaus('sv', mockT, osaamismerkkiData)).toEqual(result);
  });
});
