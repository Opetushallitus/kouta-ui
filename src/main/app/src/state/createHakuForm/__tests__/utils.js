import merge from 'lodash/merge';

import { getHakuByValues, getValuesByHaku } from '../utils';

import { HAKULOMAKETYYPPI } from '../../../constants';

const baseValues = {
  nimi: {
    fi: 'Nimi',
    sv: 'Namn',
  },
  kieliversiot: ['fi', 'sv'],
  aikataulut: {
    kausi: 'alkamiskausi_1#1',
    vuosi: { value: '2020' },
    hakuaika: [
      {
        alkaa: '2019-04-16T08:44',
        paattyy: '2019-04-18T08:44',
      },
      {
        alkaa: '2019-06-16T08:44',
        paattyy: '2019-06-18T08:44',
      },
    ],
    aikataulu: [
      {
        alkaa: '2019-08-16T08:44',
        paattyy: '2019-08-18T08:44',
      },
      {
        alkaa: '2019-09-16T08:44',
        paattyy: '2019-09-18T08:44',
      },
    ],
    lisaamisenTakaraja: '2019-09-16T08:44',
    muokkauksenTakaraja: '2019-10-16T08:44',
    ajastettuJulkaisu: '2019-11-16T08:44',
  },
  hakutapa: 'hakutapa_1#1',
  kohdejoukko: 'kohde_1#1',
  hakulomake: {
    tyyppi: HAKULOMAKETYYPPI.ATARU,
    lomake: {
      [HAKULOMAKETYYPPI.ATARU]: { value: '12345' },
    },
  },
  yhteyshenkilot: [
    {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
      sahkoposti: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
      puhelinnumero: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
      verkkosivu: { fi: 'Fi verkkosivu', sv: 'Sv verkkosivu' },
    },
  ],
  valintakoe: {
    tyypit: [{ value: 'tyyppi_1#1' }],
    tilaisuudet: {
      'tyyppi_1#1': [
        {
          osoite: { fi: 'fi osoite', sv: 'sv osoite' },
          postinumero: '00520',
          postitoimipaikka: {
            fi: 'fi posititoimipaikka',
            sv: 'sv posititoimipaikka',
          },
          alkaa: '2019-04-16T08:44',
          paattyy: '2019-04-18T08:44',
          lisatietoja: {
            fi: 'fi lisatietoja',
            sv: 'sv lisatietoja',
          },
        },
      ],
    },
  },
};

const baseHaku = {
  alkamiskausiKoodiUri: 'kausi_1#1',
  kielivalinta: ['fi', 'sv'],
  hakutapaKoodiUri: 'hakutapa_1#1',
  hakuajat: [{ alkaa: '2019-03-29T12:28', paattyy: '2019-09-29T12:30' }],
  hakukohteenLiittamisenTakaraja: '2019-03-29T12:28',
  nimi: {
    fi: 'Fi nimi',
    sv: 'Sv nimi',
  },
  kohdejoukkoKoodiUri: 'kohdejoukko_1#1',
  kohdejoukonTarkenneKoodiUri: 'tarkenne_1#1',
  metadata: {
    tulevaisuudenAikataulu: [
      { alkaa: '2019-02-20T12:28', paattyy: '2019-08-01T12:45' },
    ],
    yhteyshenkilot: [
      {
        nimi: {
          fi: 'Fi nimi',
          sv: 'Sv nimi',
        },
        titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
        sahkoposti: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
        puhelinnumero: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
        wwwSivu: { fi: 'Fi verkkosivu', sv: 'Sv verkkosivu' },
      },
    ],
  },
  hakukohteenMuokkaamisenTakaraja: '2019-03-11T09:45',
  ajastettuJulkaisu: '2020-01-20T05:00',
  alkamisvuosi: 2020,
  hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
  hakulomakeId: '12345',
  valintakokeet: [
    {
      tyyppi: 'tyyppi_1#1',
      tilaisuudet: [
        {
          osoite: {
            osoite: { fi: 'fi osoite', sv: 'sv osoite' },
            postinumero: '00520',
            postitoimipaikka: {
              fi: 'fi posititoimipaikka',
              sv: 'sv posititoimipaikka',
            },
          },
          aika: {
            alkaa: '2019-04-16T08:44',
            paattyy: '2019-04-18T08:44',
          },
          lisatietoja: {
            fi: 'fi lisatietoja',
            sv: 'sv lisatietoja',
          },
        },
      ],
    },
  ],
};

test('getHakuByValues returns correct haku given form values', () => {
  const haku = getHakuByValues(baseValues);

  expect(haku).toMatchSnapshot();
});

test('getHakuByValues returns correct haku given different hakulomake variations', () => {
  const hakuMuu = getHakuByValues(
    merge({}, baseValues, {
      hakulomake: {
        tyyppi: HAKULOMAKETYYPPI.MUU,
        linkki: { fi: 'https://google.fi' },
      },
    }),
  );

  const hakuEiHakua = getHakuByValues(
    merge({}, baseValues, {
      hakulomake: {
        tyyppi: HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
        kuvaus: { fi: 'kuvaus' },
      },
    }),
  );

  expect(hakuMuu).toMatchSnapshot();
  expect(hakuEiHakua).toMatchSnapshot();
});

test('getValuesByHaku returns correct form values given haku', () => {
  const values = getValuesByHaku(baseHaku);

  expect(values).toMatchSnapshot();
});

test('getValuesByHaku returns correct form values given different hakulomake variations', () => {
  const valuesMuu = getValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.MUU,
      hakulomakeLinkki: {
        fi: 'https://google.fi',
      },
    }),
  );

  const valuesEiHakua = getValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
      hakulomakeKuvaus: {
        fi: 'kuvaus',
      },
    }),
  );

  expect(valuesMuu).toMatchSnapshot();
  expect(valuesEiHakua).toMatchSnapshot();
});
