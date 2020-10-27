import _ from 'lodash/fp';

import { isPartialDate, maybeParseNumber } from '#/src/utils';
import getHakulomakeFieldsData from '#/src/utils/form/getHakulomakeFieldsData';
import isKorkeakoulutusKohdejoukkoKoodiUri from '#/src/utils/isKorkeakoulutusKohdejoukkoKoodiUri';
import { ALKAMISKAUSITYYPPI, TOTEUTUKSEN_AJANKOHTA } from '#/src/constants';

const getKielivalinta = values => values?.kieliversiot || [];

const isToteutuksenAjankohta = ajankohta => ({ aikataulut }) =>
  aikataulut?.toteutuksenAjankohta === ajankohta;

const hasTarkkaAjankohta = ({ aikataulut }) =>
  aikataulut?.tiedossaTarkkaAjankohta;

export const getAlkamiskausityyppi = _.cond([
  [
    isToteutuksenAjankohta(TOTEUTUKSEN_AJANKOHTA.ALKAMISKAUSI),
    _.cond([
      [hasTarkkaAjankohta, () => ALKAMISKAUSITYYPPI.TARKKA_ALKAMISAJANKOHTA],
      [_.T, () => ALKAMISKAUSITYYPPI.ALKAMISKAUSI_JA_VUOSI],
    ]),
  ],
  [
    isToteutuksenAjankohta(TOTEUTUKSEN_AJANKOHTA.HENKILOKOHTAINEN_SUUNNITELMA),
    () => ALKAMISKAUSITYYPPI.HENKILOKOHTAINEN_SUUNNITELMA,
  ],
  [_.T, () => null],
]);

const getHakuByFormValues = (values: HakuFormValues) => {
  const kielivalinta = getKielivalinta(values);

  const pickTranslations = _.pick(kielivalinta);

  const {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  } = getHakulomakeFieldsData({
    hakulomakeValues: values?.hakulomake,
    kielivalinta,
  });

  const kohdejoukkoKoodiUri = values?.kohdejoukko?.kohdejoukko || null;

  return {
    tila: values?.tila,
    kielivalinta,
    hakutapaKoodiUri: values?.hakutapa || null,
    hakuajat: (values?.aikataulut?.hakuaika || []).map(
      ({ alkaa, paattyy }) => ({
        alkaa: isPartialDate(alkaa) ? null : alkaa,
        paattyy: isPartialDate(paattyy) ? null : paattyy,
      })
    ),
    hakukohteenLiittamisenTakaraja:
      values?.aikataulut.lisaamisenTakaraja || null,
    nimi: pickTranslations(values?.nimi),
    kohdejoukkoKoodiUri,
    kohdejoukonTarkenneKoodiUri: isKorkeakoulutusKohdejoukkoKoodiUri(
      kohdejoukkoKoodiUri
    )
      ? values?.kohdejoukko?.tarkenne?.value || null
      : null,
    hakulomaketyyppi,
    metadata: {
      koulutuksenAlkamiskausi: {
        alkamiskausityyppi: getAlkamiskausityyppi(values),
        koulutuksenAlkamispaivamaara: values?.aikataulut?.tarkkaAlkaa,
        koulutuksenPaattymispaivamaara: values?.aikataulut?.tarkkaPaattyy,
        koulutuksenAlkamiskausiKoodiUri: values?.aikataulut?.kausi || null,
        koulutuksenAlkamisvuosi: maybeParseNumber(
          values?.aikataulut?.vuosi?.value
        ),
      },
      tulevaisuudenAikataulu: (values?.aikataulut?.aikataulu || []).map(
        ({ alkaa, paattyy }) => ({
          alkaa: alkaa || null,
          paattyy: paattyy || null,
        })
      ),
      yhteyshenkilot: (values?.yhteyshenkilot || []).map(
        ({ nimi, titteli, puhelinnumero, sahkoposti, verkkosivu }) => ({
          nimi: pickTranslations(nimi),
          titteli: pickTranslations(titteli),
          puhelinnumero: pickTranslations(puhelinnumero),
          wwwSivu: pickTranslations(verkkosivu),
          sahkoposti: pickTranslations(sahkoposti),
        })
      ),
    },
    hakukohteenMuokkaamisenTakaraja:
      values?.aikataulut?.muokkauksenTakaraja || null,
    ajastettuJulkaisu: values?.aikataulut?.ajastettuJulkaisu || null,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};

export default getHakuByFormValues;
