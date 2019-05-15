import get from 'lodash/get';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import { JULKAISUTILA } from '../../constants';
import { ErrorBuilder } from '../../validation';

import {
  serialize as serializeEditor,
  parse as parseEditor,
} from '../../components/Editor';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

export const getSoraKuvausByValues = values => {
  const kielivalinta = getKielivalinta(values);
  const nimi = pick(get(values, 'tiedot.nimi') || {}, kielivalinta);
  const kuvaus = pick(get(values, 'tiedot.kuvaus') || {}, kielivalinta);
  const koulutustyyppi = get(values, 'koulutustyyppi') || null;
  const julkinen = Boolean(get(values, 'julkisuus'));

  return {
    nimi,
    julkinen,
    koulutustyyppi,
    kielivalinta,
    metadata: {
      kuvaus: mapValues(kuvaus, serializeEditor),
    },
  };
};

export const getValuesBySoraKuvaus = soraKuvaus => {
  const {
    nimi,
    julkinen,
    koulutustyyppi,
    kielivalinta,
    metadata = {},
  } = soraKuvaus;

  const { kuvaus } = metadata;

  return {
    kieliversiot: kielivalinta || [],
    tiedot: {
      nimi: nimi || {},
      kuvaus: mapValues(kuvaus || {}, parseEditor),
    },
    julkinen: Boolean(julkinen),
    koulutustyyppi: koulutustyyppi || null,
  };
};

const validateEssentials = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot', 1)
    .validateTranslations('tiedot.nimi', kielivalinta);
};

const validateCommon = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateTranslations('tiedot.kuvaus', kielivalinta)
    .validateExistence('koulutustyyppi');
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
