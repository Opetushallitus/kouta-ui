import _ from 'lodash/fp';
import { getHakulomakeFieldsValues } from '#/src/utils/form/getHakulomakeFieldsValues';
import { Alkamiskausityyppi } from '#/src/constants';
import { HakuFormValues } from '#/src/types/hakuTypes';
import { parseEditorState } from '#/src/components/Editor/utils';
import { alkamiskausityyppiToAjankohtatyyppi } from '#/src/utils/form/alkamiskausityyppiHelpers';

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
    henkilokohtaisenSuunnitelmanLisatiedot,
  } = koulutuksenAlkamiskausi;

  return {
    muokkaaja,
    tila,
    nimi,
    kieliversiot: kielivalinta,
    aikataulut: {
      ajankohtaTyyppi: alkamiskausityyppiToAjankohtatyyppi(alkamiskausityyppi),
      kausi: koulutuksenAlkamiskausiKoodiUri,
      vuosi: koulutuksenAlkamisvuosi && {
        value: _.toString(koulutuksenAlkamisvuosi),
      },
      tiedossaTarkkaAjankohta:
        alkamiskausityyppi === Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
      tarkkaAlkaa: koulutuksenAlkamispaivamaara,
      tarkkaPaattyy: koulutuksenPaattymispaivamaara,
      hakuaika: hakuajat,
      aikataulu: tulevaisuudenAikataulu,
      lisaamisenTakaraja: hakukohteenLiittamisenTakaraja,
      muokkauksenTakaraja: hakukohteenMuokkaamisenTakaraja,
      ajastettuJulkaisu,
      henkilokohtaisenSuunnitelmanLisatiedot: _.mapValues(parseEditorState)(
        henkilokohtaisenSuunnitelmanLisatiedot
      ),
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
