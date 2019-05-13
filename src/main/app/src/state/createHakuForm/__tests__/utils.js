import merge from 'lodash/merge';

import { getHakuByValues, getValuesByHaku } from '../utils';

import { HAKULOMAKE_TYYPIT } from '../../../constants';

const baseValues = {
  nimi: {
    nimi: {
      fi: 'Nimi',
      sv: 'Namn',
    },
  },
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
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
  hakutapa: {
    tapa: 'hakutapa_1#1',
  },
  kohdejoukko: {
    kohde: 'kohde_1#1',
  },
  hakulomake: {
    tyyppi: HAKULOMAKE_TYYPIT.ATARU,
    lomake: {
      [HAKULOMAKE_TYYPIT.ATARU]: { value: '12345' },
    },
  },
  yhteystiedot: {
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
    email: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
    puhelin: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
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
    yhteystieto: {
      nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
      titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
      sahkoposti: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
      puhelinnumero: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
    },
  },
  hakukohteenMuokkaamisenTakaraja: '2019-03-11T09:45',
  ajastettuJulkaisu: '2020-01-20T05:00',
  alkamisvuosi: 2020,
  hakulomaketyyppi: HAKULOMAKE_TYYPIT.ATARU,
  hakulomakeId: '12345',
};

test('getHakuByValues returns correct haku given form values', () => {
  const haku = getHakuByValues(baseValues);

  expect(haku).toMatchSnapshot();
});

test('getHakuByValues returns correct haku given different hakulomake variations', () => {
  const hakuMuu = getHakuByValues(
    merge({}, baseValues, {
      hakulomake: {
        tyyppi: HAKULOMAKE_TYYPIT.MUU,
        linkki: { fi: 'https://google.fi' },
      },
    }),
  );

  const hakuEiHakua = getHakuByValues(
    merge({}, baseValues, {
      hakulomake: {
        tyyppi: HAKULOMAKE_TYYPIT.EI_SAHKOISTA_HAKUA,
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
      hakulomaketyyppi: HAKULOMAKE_TYYPIT.MUU,
      hakulomakeLinkki: {
        fi: 'https://google.fi',
      },
    }),
  );

  const valuesEiHakua = getValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKE_TYYPIT.EI_SAHKOISTA_HAKUA,
      hakulomakeKuvaus: {
        fi: 'kuvaus',
      },
    }),
  );

  expect(valuesMuu).toMatchSnapshot();
  expect(valuesEiHakua).toMatchSnapshot();
});
