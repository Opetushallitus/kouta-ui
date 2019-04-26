import get from 'lodash/get';
import pick from 'lodash/pick';

import { isNumeric } from '../../utils';
import { JULKAISUTILA } from '../../constants';
import { ErrorBuilder } from '../../validation';

const getKielivalinta = values => get(values, 'kieliversiot.languages') || [];

export const getHakuByValues = values => {
  const alkamiskausiKoodiUri = get(values, 'aikataulut.kausi') || null;

  const alkamisvuosi = isNumeric(get(values, 'aikataulut.vuosi.value'))
    ? parseInt(values.aikataulut.vuosi.value)
    : null;

  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const hakutapaKoodiUri = get(values, 'hakutapa.tapa') || null;

  const hakuajat = (get(values, 'aikataulut.hakuaika') || []).map(
    ({ alkaa, paattyy }) => ({
      alkaa: alkaa || null,
      paattyy: paattyy || null,
    }),
  );

  const hakulomaketyyppi = get(values, 'hakulomake.lomaketyyppi') || null;

  const hakulomake = get(values, 'hakulomake.lomake') || null;

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
    yhteystieto: {
      nimi: pick(get(values, 'yhteystiedot.nimi') || null, kielivalinta),
      titteli: pick(get(values, 'yhteystiedot.titteli') || null, kielivalinta),
      sahkoposti: pick(get(values, 'yhteystiedot.email') || null, kielivalinta),
      puhelinnumero: pick(
        get(values, 'yhteystiedot.puhelin') || null,
        kielivalinta,
      ),
    },
  };

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
    hakulomake,
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
    hakukohteenLiittamisenTakaraja,
    hakukohteenMuokkaamisenTakaraja,
    ajastettuJulkaisu,
    kielivalinta = [],
    nimi = {},
    metadata = {},
  } = haku;

  const { yhteystieto = {} } = metadata;

  const { tulevaisuudenAikataulu = [] } = metadata;

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
    hakutapa: {
      tapa: hakutapaKoodiUri,
    },
    kohdejoukko: {
      kohde: kohdejoukkoKoodiUri,
    },
    hakulomake: {
      lomaketyyppi: hakulomaketyyppi,
    },
    yhteystiedot: {
      nimi: get(yhteystieto, 'nimi') || {},
      titteli: get(yhteystieto, 'titteli') || {},
      email: get(yhteystieto, 'sahkoposti') || {},
      puhelin: get(yhteystieto, 'puhelinnumero') || {},
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
  const kielivalinta = getKielivalinta(values);
  const hakutapa = get(values, 'hakutapa.tapa');
  const isYhteishaku = new RegExp('^hakutapa_01').test(hakutapa);
  const isErillishaku = new RegExp('^hakutapa_02').test(hakutapa);

  let enhancedErrorBuilder = errorBuilder
    .validateExistence('kohdejoukko.kohde')
    .validateExistence('hakutapa.tapa')
    .validateArrayMinLength('aikataulut.hakuaika', 1, { isFieldArray: true })
    .validateArray('aikataulut.hakuaika', eb => {
      if (isErillishaku || isYhteishaku) {
        return eb.validateExistence('alkaa').validateExistence('paattyy');
      }

      return eb.validateExistence('alkaa');
    });

  const shouldValidateContactName = Boolean(
    [
      get(values, 'yhteystiedot.email'),
      get(values, 'yhteystiedot.puhelin'),
      get(values, 'yhteystiedot.verkkosivu'),
    ].find(v => !!v),
  );

  if (shouldValidateContactName) {
    enhancedErrorBuilder = enhancedErrorBuilder.validateTranslations(
      'yhteystiedot.nimi',
      kielivalinta,
    );
  }

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
