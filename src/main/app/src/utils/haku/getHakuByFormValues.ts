import _fp from 'lodash/fp';

import { isPartialDate, maybeParseNumber } from '#/src/utils';
import { getHakulomakeFieldsData } from '#/src/utils/form/getHakulomakeFieldsData';
import isKorkeakoulutusKohdejoukkoKoodiUri from '#/src/utils/isKorkeakoulutusKohdejoukkoKoodiUri';
import { HakuFormValues } from '#/src/types/hakuTypes';
import { serializeEditorState } from '#/src/components/Editor/utils';
import { getAlkamiskausityyppiByAjankohtaSection } from '../form/alkamiskausityyppiHelpers';

const getKielivalinta = values => values?.kieliversiot || [];

export const getHakuByFormValues = (values: HakuFormValues) => {
  const kielivalinta = getKielivalinta(values);

  const pickTranslations = _fp.pick(kielivalinta);

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
    muokkaaja: values?.muokkaaja,
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
      values?.aikataulut?.lisaamisenTakaraja || null,
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
        alkamiskausityyppi: getAlkamiskausityyppiByAjankohtaSection(
          values?.aikataulut
        ),
        koulutuksenAlkamispaivamaara: values?.aikataulut?.tarkkaAlkaa,
        koulutuksenPaattymispaivamaara: values?.aikataulut?.tarkkaPaattyy,
        koulutuksenAlkamiskausiKoodiUri: values?.aikataulut?.kausi || null,
        koulutuksenAlkamisvuosi: maybeParseNumber(
          values?.aikataulut?.vuosi?.value
        ),
        henkilokohtaisenSuunnitelmanLisatiedot: _fp.compose(
          _fp.mapValues(serializeEditorState),
          pickTranslations
        )(values?.aikataulut?.henkilokohtaisenSuunnitelmanLisatiedot ?? {}),
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
