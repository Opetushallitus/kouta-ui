import { useMemo } from 'react';

import { isFunction, isString, getFirstLanguageValue } from '../../utils';
import { HAKULOMAKETYYPPI } from '../../constants';
import { getHakemuspalveluLomakkeet } from '../../apiUtils';
import useApiAsync from '../useApiAsync';

const tyyppiToLabel = {
  [HAKULOMAKETYYPPI.ATARU]: 'hakulomakeValinnat.ataru',
  [HAKULOMAKETYYPPI.HAKUAPP]: 'hakulomakeValinnat.hakuapp',
  [HAKULOMAKETYYPPI.MUU]: 'hakulomakeValinnat.muu',
  [HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA]: 'hakulomakeValinnat.eiSahkoistaHakua',
};

export const createEnhancedGetTyyppiLabel = (getTyyppiLabel, t) => tyyppi => {
  const key = isString(tyyppi) ? tyyppiToLabel[tyyppi] : null;
  const translated = key ? t(key) : null;

  return isFunction(getTyyppiLabel)
    ? getTyyppiLabel(tyyppi) || translated
    : translated;
};

export const createEnhancedGetTyyppiShowUrl = getTyyppiShowUrl => ({
  tyyppi,
  option,
  apiUrls,
}) => {
  if (!option || !option.value) {
    return null;
  }

  if (isFunction(getTyyppiShowUrl)) {
    return getTyyppiShowUrl({ tyyppi, option, apiUrls });
  }

  if (tyyppi === HAKULOMAKETYYPPI.ATARU) {
    return apiUrls.url('lomake-editori.muokkaus-sivu', option.value);
  }

  return null;
};

export const createEnhancedGetTyyppiLomakkeet = getTyyppiOptions => async ({
  httpClient,
  apiUrls,
  tyyppi,
}) => {
  if (isFunction(getTyyppiOptions)) {
    return getTyyppiOptions({ httpClient, apiUrls, tyyppi });
  }

  if (tyyppi === HAKULOMAKETYYPPI.ATARU) {
    try {
      const ataruLomakkeet = await getHakemuspalveluLomakkeet({
        httpClient,
        apiUrls,
      });

      return ataruLomakkeet.map(({ name, key }) => ({ name, id: key }));
    } catch (e) {
      return [];
    }
  }

  return [];
};

export const getOptions = (forms, language) => {
  return forms.map(({ name, id }) => ({
    value: id,
    label: getFirstLanguageValue(name, language),
  }));
};

const noopPromise = () => Promise.resolve([]);

export const useLomakeOptions = ({ getTyyppiLomakkeet, tyypit, language }) => {
  const enhancedGetTyyppiLomakkeet = useMemo(
    () => createEnhancedGetTyyppiLomakkeet(getTyyppiLomakkeet),
    [getTyyppiLomakkeet],
  );

  const { data: ataruLomakkeet } = useApiAsync({
    promiseFn: tyypit.includes(HAKULOMAKETYYPPI.ATARU)
      ? enhancedGetTyyppiLomakkeet
      : noopPromise,
    tyyppi: HAKULOMAKETYYPPI.ATARU,
  });

  const ataruOptions = useMemo(
    () => getOptions(ataruLomakkeet || [], language),
    [ataruLomakkeet, language],
  );

  return { ataruOptions };
};
