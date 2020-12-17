import _ from 'lodash';

import {
  Alkamiskausityyppi,
  HAKULOMAKETYYPPI,
  Ajankohtatyyppi,
} from '#/src/constants';
import { getFormValuesByHaku } from './getFormValuesByHaku';
import { serializeEditorState } from '#/src/components/Editor/utils';
import { alkamiskausityyppiToAjankohtatyyppi } from '#/src/utils/form/alkamiskausityyppiHelpers';

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
      alkamiskausityyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
      koulutuksenAlkamiskausiKoodiUri: 'alkamiskausi_1#1',
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
  hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
  hakulomakeAtaruId: '12345',
};

test('getFormValuesByHaku returns correct form values given haku', () => {
  const values = getFormValuesByHaku(baseHaku);

  expect(values).toMatchSnapshot();
});

test('getFormValuesByHaku returns correct form values given different hakulomake variations', () => {
  const valuesMuu = getFormValuesByHaku(
    _.merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.MUU,
      hakulomakeLinkki: {
        fi: 'https://google.fi',
      },
    })
  );

  const valuesEiHakua = getFormValuesByHaku(
    _.merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
      hakulomakeKuvaus: {
        fi: '<p>kuvaus</p>',
      },
    })
  );

  expect(valuesMuu).toMatchSnapshot();
  expect(valuesEiHakua).toMatchSnapshot();
});

test('getFormValuesByHaku toteutuksen ajankohta - Tarkka alkamisaika', () => {
  expect(
    getFormValuesByHaku(
      _.merge({}, baseHaku, {
        metadata: {
          koulutuksenAlkamiskausi: {
            alkamiskausityyppi: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
            koulutuksenAlkamiskausiKoodiUri: 'alkamiskausi_1#1',
            koulutuksenAlkamispaivamaara: '2030-12-20T12:28',
            koulutuksenPaattymispaivamaara: '2030-12-21T12:28',
            koulutuksenAlkamisvuosi: '2030',
          },
        },
      })
    )
  ).toMatchSnapshot();
});

test('getFormValuesByHaku toteutuksen ajankohta - Aloitus henkilokohtaisen suunnitelman mukaisesti', () => {
  const henkKohtLisatiedotValues = {
    fi: '<p>hlokoht fi </p>',
    sv: '<p>hlokoht sv </p>',
    en: '<p>hlokoht en </p>',
  };

  const values = getFormValuesByHaku(
    _.merge({}, baseHaku, {
      metadata: {
        koulutuksenAlkamiskausi: {
          alkamiskausityyppi: Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
          henkilokohtaisenSuunnitelmanLisatiedot: henkKohtLisatiedotValues,
          koulutuksenAlkamiskausiKoodiUri: null,
          koulutuksenAlkamispaivamaara: null,
          koulutuksenPaattymispaivamaara: null,
          koulutuksenAlkamisvuosi: null,
        },
      },
    })
  );
  expect(values).toMatchSnapshot();

  _.each(
    values?.aikataulut.henkilokohtaisenSuunnitelmanLisatiedot,
    (lisatiedotEditorState, lisatiedotKey) => {
      expect(serializeEditorState(lisatiedotEditorState)).toEqual(
        henkKohtLisatiedotValues[lisatiedotKey]
      );
    }
  );
});

test('alkamiskausityyppiToToteutuksenAjankohta', () => {
  expect(
    alkamiskausityyppiToAjankohtatyyppi(
      Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI
    )
  ).toEqual(Ajankohtatyyppi.ALKAMISKAUSI);

  expect(
    alkamiskausityyppiToAjankohtatyyppi(
      Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA
    )
  ).toEqual(Ajankohtatyyppi.ALKAMISKAUSI);

  expect(
    alkamiskausityyppiToAjankohtatyyppi(
      Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA
    )
  ).toEqual(Ajankohtatyyppi.HENKILOKOHTAINEN_SUUNNITELMA);
});
