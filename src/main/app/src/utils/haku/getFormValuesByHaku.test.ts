import { merge } from 'lodash';

import {
  ALKAMISKAUSITYYPPI,
  HAKULOMAKETYYPPI,
  TOTEUTUKSEN_AJANKOHTA,
} from '#/src/constants';
import {
  alkamiskausityyppiToToteutuksenAjankohta,
  getFormValuesByHaku,
} from './getFormValuesByHaku';

const baseHaku = {
  muokkaaja: '1.1.1.1',
  tila: 'tallennettu',
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
    koulutuksenAlkamiskausi: {
      alkamiskausityyppi: 'tarkka alkamisajankohta',
      koulutuksenAlkamiskausiKoodiUri: 'alkamiskausi_1#1',
      koulutuksenAlkamispaivamaara: '2020-12-20T12:28',
      koulutuksenPaattymispaivamaara: '2020-12-21T12:28',
      koulutuksenAlkamisvuosi: '2020',
    },
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
  hakulomakeAtaruId: '12345',
};

test('getFormValuesByHaku returns correct form values given haku', () => {
  const values = getFormValuesByHaku(baseHaku);

  expect(values).toMatchSnapshot();
});

test('getFormValuesByHaku returns correct form values given different hakulomake variations', () => {
  const valuesMuu = getFormValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.MUU,
      hakulomakeLinkki: {
        fi: 'https://google.fi',
      },
    })
  );

  const valuesEiHakua = getFormValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
      hakulomakeKuvaus: {
        fi: '<p>kuvaus</p>',
      },
    })
  );

  expect(valuesMuu).toMatchSnapshot();
  expect(valuesEiHakua).toMatchSnapshot();
});

test('alkamiskausityyppiToToteutuksenAjankohta', () => {
  expect(
    alkamiskausityyppiToToteutuksenAjankohta(
      ALKAMISKAUSITYYPPI.ALKAMISKAUSI_JA_VUOSI
    )
  ).toEqual(TOTEUTUKSEN_AJANKOHTA.ALKAMISKAUSI);

  expect(
    alkamiskausityyppiToToteutuksenAjankohta(
      ALKAMISKAUSITYYPPI.TARKKA_ALKAMISAJANKOHTA
    )
  ).toEqual(TOTEUTUKSEN_AJANKOHTA.ALKAMISKAUSI);

  expect(
    alkamiskausityyppiToToteutuksenAjankohta(
      ALKAMISKAUSITYYPPI.HENKILOKOHTAINEN_SUUNNITELMA
    )
  ).toEqual(TOTEUTUKSEN_AJANKOHTA.HENKILOKOHTAINEN_SUUNNITELMA);
});
