import get from 'lodash/get';
import pick from 'lodash/pick';

import { isNumeric } from '../../utils';
import { JULKAISUTILA } from '../../constants';
import { ErrorBuilder } from '../../validation';
import { getHakulomakeFieldsData, getHakulomakeFieldsValues } from '../utils';

const getKielivalinta = values => get(values, 'kieliversiot.languages') || [];

export const getHakuByValues = values => {
  const alkamiskausiKoodiUri = get(values, 'aikataulut.kausi') || null;

  const alkamisvuosi = isNumeric(get(values, 'aikataulut.vuosi.value'))
    ? parseInt(values.aikataulut.vuosi.value)
    : null;

  const kielivalinta = getKielivalinta(values);

  const hakutapaKoodiUri = get(values, 'hakutapa') || null;

  const hakuajat = (get(values, 'aikataulut.hakuaika') || []).map(
    ({ alkaa, paattyy }) => ({
      alkaa: alkaa || null,
      paattyy: paattyy || null,
    }),
  );

  const {
    hakulomaketyyppi,
    hakulomakeId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  } = getHakulomakeFieldsData({ values, kielivalinta });

  const hakukohteenLiittamisenTakaraja =
    get(values, 'aikataulut.lisaamisenTakaraja') || null;

  const ajastettuJulkaisu = get(values, 'aikataulut.ajastettuJulkaisu') || null;

  const nimi = pick(get(values, 'nimi.nimi') || null, kielivalinta);

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.kohde') || null;

  const kohdejoukonTarkenneKoodiUri = null;

  const metadata = {
    tulevaisuudenAikataulu: (get(values, 'aikataulut.aikataulu') || []).map(
      ({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      }),
    ),
    yhteyshenkilot: (get(values, 'yhteyshenkilot') || []).map(
      ({ nimi, titteli, puhelinnumero, sahkoposti, verkkosivu }) => ({
        nimi: pick(nimi || {}, kielivalinta),
        titteli: pick(titteli || {}, kielivalinta),
        puhelinnumero: pick(puhelinnumero || {}, kielivalinta),
        wwwSivu: pick(verkkosivu || {}, kielivalinta),
        sahkoposti: pick(sahkoposti || {}, kielivalinta),
      }),
    ),
  };

  const valintakokeet = (get(values, 'valintakoe.tyypit') || []).map(
    ({ value }) => ({
      tyyppi: value,
      tilaisuudet: (
        get(values, ['valintakoe', 'tilaisuudet', value]) || []
      ).map(
        ({
          osoite,
          postinumero,
          postitoimipaikka,
          alkaa,
          paattyy,
          lisatietoja,
        }) => ({
          osoite: {
            osoite: pick(osoite || {}, kielivalinta),
            postinumero: postinumero || null,
            postitoimipaikka: pick(postitoimipaikka || {}, kielivalinta),
          },
          aika: {
            alkaa: alkaa || null,
            paattyy: paattyy || null,
          },
          lisatietoja: pick(lisatietoja || {}, kielivalinta),
        }),
      ),
    }),
  );

  const hakukohteenMuokkaamisenTakaraja =
    get(values, 'aikataulut.muokkauksenTakaraja') || null;

  return {
    alkamiskausiKoodiUri,
    kielivalinta,
    hakutapaKoodiUri,
    hakuajat,
    hakukohteenLiittamisenTakaraja,
    nimi,
    kohdejoukkoKoodiUri,
    kohdejoukonTarkenneKoodiUri,
    hakulomaketyyppi,
    metadata,
    hakukohteenMuokkaamisenTakaraja,
    ajastettuJulkaisu,
    alkamisvuosi,
    hakulomakeId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
    valintakokeet,
  };
};

export const getValuesByHaku = haku => {
  const {
    alkamiskausiKoodiUri = '',
    alkamisvuosi = '',
    hakuajat = [],
    hakutapaKoodiUri = '',
    kohdejoukkoKoodiUri = '',
    hakulomaketyyppi = '',
    hakulomakeId = '',
    hakulomakeKuvaus = {},
    hakulomakeLinkki = {},
    hakukohteenLiittamisenTakaraja,
    hakukohteenMuokkaamisenTakaraja,
    ajastettuJulkaisu,
    kielivalinta = [],
    valintakokeet = [],
    nimi = {},
    metadata = {},
  } = haku;

  const { tulevaisuudenAikataulu = [], yhteyshenkilot = [] } = metadata;

  return {
    nimi: {
      nimi: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
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
      kohde: kohdejoukkoKoodiUri,
    },
    hakulomake: getHakulomakeFieldsValues({
      hakulomaketyyppi,
      hakulomakeId,
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
    valintakoe: {
      tyypit: (valintakokeet || []).map(({ tyyppi }) => ({ value: tyyppi })),
      tilaisuudet: (valintakokeet || []).reduce(
        (acc, { tyyppi, tilaisuudet }) => ({
          ...acc,
          [tyyppi]: (tilaisuudet || []).map(
            ({ osoite, aika, lisatietoja }) => ({
              osoite: get(osoite, 'osoite') || {},
              postinumero: get(osoite, 'postinumero') || '',
              postitoimipaikka: get(osoite, 'postitoimipaikka') || {},
              alkaa: get(aika, 'alkaa') || '',
              paattyy: get(aika, 'paattyy') || '',
              lisatietoja: lisatietoja || {},
            }),
          ),
        }),
        {},
      ),
    },
  };
};

const validateEssentials = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot.languages', 1)
    .validateTranslations('nimi.nimi', kielivalinta);
};

const validateCommon = ({ values, errorBuilder }) => {
  const hakutapa = get(values, 'hakutapa');
  const isYhteishaku = new RegExp('^hakutapa_01').test(hakutapa);
  const isErillishaku = new RegExp('^hakutapa_02').test(hakutapa);

  let enhancedErrorBuilder = errorBuilder
    .validateExistence('kohdejoukko.kohde')
    .validateExistence('hakutapa')
    .validateArrayMinLength('aikataulut.hakuaika', 1, { isFieldArray: true })
    .validateArray('aikataulut.hakuaika', eb => {
      if (isErillishaku || isYhteishaku) {
        return eb.validateExistence('alkaa').validateExistence('paattyy');
      }

      return eb.validateExistence('alkaa');
    });

  return enhancedErrorBuilder;
};

export const validate = ({ tila, values }) => {
  let errorBuilder = new ErrorBuilder({ values });

  errorBuilder = validateEssentials({ values, errorBuilder });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  return errorBuilder.getErrors();
};
