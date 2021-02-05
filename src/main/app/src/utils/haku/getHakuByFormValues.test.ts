import { mapValues, merge } from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';
import {
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  Alkamiskausityyppi,
} from '#/src/constants';
import { HakuFormValues } from '#/src/types/hakuTypes';
import { getHakuByFormValues } from '#/src/utils/haku/getHakuByFormValues';

const baseValues: HakuFormValues = {
  muokkaaja: '1.1.1.1',
  tila: JULKAISUTILA.TALLENNETTU,
  nimi: {
    fi: 'Nimi',
    sv: 'Namn',
  },
  kieliversiot: ['fi', 'sv'],
  aikataulut: {
    ajankohtaTyyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
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
        kuvaus: { fi: parseEditorState('kuvaus') },
      },
    })
  );

  expect(hakuMuu).toMatchSnapshot();
  expect(hakuEiHakua).toMatchSnapshot();
});

test('getHakuByFormValues toteutuksen ajankohta - Tarkka alkamisaika', () => {
  expect(
    getHakuByFormValues(
      merge({}, baseValues, {
        aikataulut: {
          ajankohtaTyyppi: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
          tarkkaAlkaa: '2019-09-16T08:44',
          tarkkaPaattyy: '2019-09-16T08:44',
        },
      })
    )
  ).toMatchSnapshot();
});

test('getHakuByFormValues toteutuksen ajankohta - Aloitus henkilokohtaisen suunnitelman mukaisesti', () => {
  expect(
    getHakuByFormValues(
      merge({}, baseValues, {
        aikataulut: {
          ajankohtaTyyppi: Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
          henkilokohtaisenSuunnitelmanLisatiedot: mapValues(
            {
              fi: '<p>hlokoht fi </p>',
              sv: '<p>hlokoht sv </p>',
              en: '<p>hlokoht en </p>',
            },
            parseEditorState
          ),
        },
      })
    )
  ).toMatchSnapshot();
});
