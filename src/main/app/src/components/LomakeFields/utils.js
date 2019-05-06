import { isFunction, isString, getFirstLanguageValue } from '../../utils';
import { HAKULOMAKE_TYYPIT } from '../../constants';

const tyyppiToLabel = {
  [HAKULOMAKE_TYYPIT.ATARU]: 'hakulomakeValinnat.ataru',
  [HAKULOMAKE_TYYPIT.HAKUAPP]: 'hakulomakeValinnat.hakuapp',
  [HAKULOMAKE_TYYPIT.MUU]: 'hakulomakeValinnat.muu',
  [HAKULOMAKE_TYYPIT.EI_SAHKOISTA_HAKUA]: 'hakulomakeValinnat.eiSahkoistaHakua',
};

export const createEnhancedGetTyyppiLabel = (getTyyppiLabel, t) => tyyppi => {
  const key = isString(tyyppi) ? tyyppiToLabel[tyyppi] : null;
  const translated = key ? t(key) : null;

  return isFunction(getTyyppiLabel)
    ? getTyyppiLabel(tyyppi) || translated
    : translated;
};

export const createEnhancedGetTyyppiLomakkeet = getTyyppiOptions => ({
  httpClient,
  apiUrls,
  tyyppi,
}) => {
  if (isFunction(getTyyppiOptions)) {
    return getTyyppiOptions({ httpClient, apiUrls, tyyppi });
  }

  if (tyyppi === HAKULOMAKE_TYYPIT.ATARU) {
    return Promise.resolve([]);
  }

  if (tyyppi === HAKULOMAKE_TYYPIT.HAKUAPP) {
    return Promise.resolve([]);
  }

  return Promise.resolve([]);
};

export const getOptions = (forms, language) => {
  return forms.map(({ name, id }) => ({
    value: id,
    label: getFirstLanguageValue(name, language),
  }));
};
