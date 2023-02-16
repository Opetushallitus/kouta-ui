import { HakuFormValues } from '#/src/types/hakuTypes';
import { toSelectValue } from '#/src/utils';
import { getAjankohtaFields } from '#/src/utils/form/aloitusajankohtaHelpers';
import { getHakulomakeFieldsValues } from '#/src/utils/form/getHakulomakeFieldsValues';

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
    ajastettuHaunJaHakukohteidenArkistointi,
    kielivalinta = [],
    nimi = {},
    metadata = {},
    tila,
    externalId,
    organisaatioOid,
  } = haku;

  const {
    tulevaisuudenAikataulu = [],
    yhteyshenkilot = [],
    koulutuksenAlkamiskausi,
  } = metadata;

  return {
    organisaatioOid: toSelectValue(organisaatioOid),
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
      ajastettuHaunJaHakukohteidenArkistointi,
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
      ({
        nimi,
        titteli,
        puhelinnumero,
        sahkoposti,
        wwwSivu,
        wwwSivuTeksti,
      }) => ({
        nimi: nimi || {},
        titteli: titteli || {},
        puhelinnumero: puhelinnumero || {},
        sahkoposti: sahkoposti || {},
        verkkosivu: wwwSivu || {},
        verkkosivuTeksti: wwwSivuTeksti || {},
      })
    ),
  };
};
