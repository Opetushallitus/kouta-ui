import getValintakoeFieldsValues from './getValintakoeFieldsValues';
import getHakulomakeFieldsValues from './getHakulomakeFieldsValues';

const getFormValuesByHaku = haku => {
  const {
    alkamiskausiKoodiUri = '',
    alkamisvuosi = '',
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
    valintakokeet = [],
    nimi = {},
    metadata = {},
    tila,
  } = haku;

  const { tulevaisuudenAikataulu = [], yhteyshenkilot = [] } = metadata;

  return {
    tila,
    nimi,
    kieliversiot: kielivalinta,
    aikataulut: {
      kausi: alkamiskausiKoodiUri,
      vuosi: { value: alkamisvuosi ? alkamisvuosi.toString() : '' },
      hakuaika: (hakuajat || []).map(({ alkaa, paattyy }) => {
        return {
          alkaa,
          paattyy,
        };
      }),
      aikataulu: (tulevaisuudenAikataulu || []).map(({ alkaa, paattyy }) => {
        return {
          alkaa,
          paattyy,
        };
      }),
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
      }),
    ),
    valintakoe: getValintakoeFieldsValues(valintakokeet),
  };
};

export default getFormValuesByHaku;
