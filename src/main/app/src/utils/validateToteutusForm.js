import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';
import createErrorBuilder from './createErrorBuilder';
import isKorkeakouluKoulutustyyppi from './isKorkeakouluKoulutustyyppi';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateEssentials = ({ errorBuilder, values }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot', 1)
    .validateTranslations('nimi', kielivalinta);
};

const validateCommon = ({ errorBuilder }) => {
  let enhancedErrorBuilder = errorBuilder
    .validateArrayMinLength('jarjestamispaikat', 1)
    .validateArrayMinLength('jarjestamistiedot.opetusaika', 1)
    .validateArrayMinLength('jarjestamistiedot.opetuskieli', 1)
    .validateExistence('jarjestamistiedot.maksullisuus.tyyppi');

  return enhancedErrorBuilder;
};

const validateKorkeakoulu = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArray('ylemmanKorkeakoulututkinnonOsaamisalat', eb => {
      return eb.validateTranslations('nimi', kielivalinta);
    })
    .validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb => {
      return eb.validateTranslations('nimi', kielivalinta);
    });
};

const validateToteutusForm = values => {
  const { tila, koulutustyyppi } = values;

  let errorBuilder = createErrorBuilder(values);

  errorBuilder = validateEssentials({ errorBuilder, values });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    errorBuilder = validateKorkeakoulu({ values, errorBuilder });
  }

  return errorBuilder.getErrors();
};

export default validateToteutusForm;
