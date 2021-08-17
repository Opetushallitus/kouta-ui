import { HakuFormValues } from '#/src/types/hakuTypes';
import { getHakulomakeFieldsValues } from '#/src/utils/form/getHakulomakeFieldsValues';

import { getAjankohtaFields } from '../form/aloitusajankohtaHelpers';

export const getFormValuesByHaku = (haku): HakuFormValues => {
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
    externalId,
  } = haku;

  const {
    tulevaisuudenAikataulu = [],
    yhteyshenkilot = [],
    koulutuksenAlkamiskausi,
  } = metadata;

  return {
    externalId,
    muokkaaja,
    tila,
    nimi,
    kieliversiot: kielivalinta,
    aikataulut: {
      ...getAjankohtaFields(koulutuksenAlkamiskausi),
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
