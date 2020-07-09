import { merge } from 'lodash';

import getHakuByFormValues from '#/src/utils/haku/getHakuByFormValues';

import { HAKULOMAKETYYPPI } from '#/src/constants';

const baseValues = {
  tila: 'tallennettu',
  muokkaaja: '1.1.1.1',
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
  kohdejoukko: {
    kohdejoukko: 'haunkohdejoukko_12',
    tarkenne: { value: 'tarkenne_1#1' },
  },
  hakulomake: {
    tyyppi: HAKULOMAKETYYPPI.ATARU,
    lomake: { value: '12345' },
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
};

test('getHakuByFormValues returns correct haku given form values', () => {
  const haku = getHakuByFormValues(baseValues);

  expect(haku).toMatchSnapshot();
});

test('getHakuByFormValues returns correct haku given different hakulomake variations', () => {
  const hakuMuu = getHakuByFormValues(
    merge({}, baseValues, {
      hakulomake: {
        tyyppi: HAKULOMAKETYYPPI.MUU,
        linkki: { fi: 'https://google.fi' },
      },
    })
  );

  const hakuEiHakua = getHakuByFormValues(
    merge({}, baseValues, {
      hakulomake: {
        tyyppi: HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
        kuvaus: { fi: 'kuvaus' },
      },
    })
  );

  expect(hakuMuu).toMatchSnapshot();
  expect(hakuEiHakua).toMatchSnapshot();
});
