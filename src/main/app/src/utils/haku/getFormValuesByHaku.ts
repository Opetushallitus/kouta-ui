import _ from 'lodash/fp';
import getHakulomakeFieldsValues from '#/src/utils/form/getHakulomakeFieldsValues';
import { ALKAMISKAUSITYYPPI, TOTEUTUKSEN_AJANKOHTA } from '#/src/constants';
import { HakuFormValues } from '#/src/types/hakuTypes';

export const alkamiskausityyppiToToteutuksenAjankohta = _.cond([
  [
    _.overSome([
      _.isEqual(ALKAMISKAUSITYYPPI.ALKAMISKAUSI_JA_VUOSI),
      _.isEqual(ALKAMISKAUSITYYPPI.TARKKA_ALKAMISAJANKOHTA),
    ]),
    () => TOTEUTUKSEN_AJANKOHTA.ALKAMISKAUSI,
  ],
  [
    _.isEqual(ALKAMISKAUSITYYPPI.HENKILOKOHTAINEN_SUUNNITELMA),
    () => TOTEUTUKSEN_AJANKOHTA.HENKILOKOHTAINEN_SUUNNITELMA,
  ],
]);

const getFormValuesByHaku = (haku): HakuFormValues => {
  const {
    muokkaaja,
    hakuajat = [],
    hakutapaKoodiUri = '',
    kohdejoukkoKoodiUri = '',
    kohdejoukonTarkenneKoodiUri = '',
    hakulomaketyyppi = '',
    hakulomakeAtaruId = '',
    hakulomakeKuvaus = {},
    hakulomakeLinkki = {},
    hakukohteenLiittamisenTakaraja,
    hakukohteenMuokkaamisenTakaraja,
    ajastettuJulkaisu,
    kielivalinta = [],
    nimi = {},
    metadata = {},
    tila,
  } = haku;

  const {
    tulevaisuudenAikataulu = [],
    yhteyshenkilot = [],
    koulutuksenAlkamiskausi = {},
  } = metadata;

  const {
    alkamiskausityyppi,
    koulutuksenAlkamiskausiKoodiUri = null,
    koulutuksenAlkamispaivamaara = null,
    koulutuksenPaattymispaivamaara = null,
    koulutuksenAlkamisvuosi = '',
  } = koulutuksenAlkamiskausi;

  return {
    muokkaaja,
    tila,
    nimi,
    kieliversiot: kielivalinta,
    aikataulut: {
      toteutuksenAjankohta: alkamiskausityyppiToToteutuksenAjankohta(
        alkamiskausityyppi
      ),
      kausi: koulutuksenAlkamiskausiKoodiUri,
      vuosi: { value: _.toString(koulutuksenAlkamisvuosi) || '' },
      tiedossaTarkkaAjankohta:
        alkamiskausityyppi === ALKAMISKAUSITYYPPI.TARKKA_ALKAMISAJANKOHTA,
      tarkkaAlkaa: koulutuksenAlkamispaivamaara,
      tarkkaPaattyy: koulutuksenPaattymispaivamaara,
      hakuaika: hakuajat,
      aikataulu: tulevaisuudenAikataulu,
      lisaamisenTakaraja: hakukohteenLiittamisenTakaraja,
      muokkauksenTakaraja: hakukohteenMuokkaamisenTakaraja,
      ajastettuJulkaisu,
    },
    hakutapa: hakutapaKoodiUri,
    kohdejoukko: {
      kohdejoukko: kohdejoukkoKoodiUri,
      tarkenne: kohdejoukonTarkenneKoodiUri
        ? { value: kohdejoukonTarkenneKoodiUri }
        : null,
    },
    hakulomake: getHakulomakeFieldsValues({
      hakulomaketyyppi,
      hakulomakeAtaruId,
      hakulomakeKuvaus,
      hakulomakeLinkki,
    }),
    yhteyshenkilot: yhteyshenkilot.map(
      ({ nimi, titteli, puhelinnumero, sahkoposti, wwwSivu }) => ({
        nimi: nimi || {},
        titteli: titteli || {},
        puhelinnumero: puhelinnumero || {},
        sahkoposti: sahkoposti || {},
        verkkosivu: wwwSivu || {},
      })
    ),
  };
};

export default getFormValuesByHaku;
