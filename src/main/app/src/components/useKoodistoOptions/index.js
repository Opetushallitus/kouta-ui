import { useMemo } from 'react';
import mapValues from 'lodash/mapValues';
import sortBy from 'lodash/sortBy';

import useApiAsync from '../useApiAsync';
import {
  isArray,
  arrayToTranslationObject,
  getFirstLanguageValue,
} from '../../utils';

import { getKoodisto } from '../../apiUtils';

const getKoodistoNimet = async ({
  httpClient,
  apiUrls,
  koodistoUri,
  koodistoVersio,
}) => {
  const osiot = await getKoodisto({
    koodistoUri,
    koodistoVersio,
    httpClient,
    apiUrls,
  });

  return isArray(osiot)
    ? osiot.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

const getOptions = ({ koodisto, language }) =>
  sortBy(
    koodisto.map(({ nimi, koodiUri }) => ({
      value: koodiUri,
      label: getFirstLanguageValue(nimi, language),
    })),
    ({ label }) => label,
  );

export const useKoodistoOptions = ({
  koodisto,
  versio = '',
  language = 'fi',
}) => {
  const watch = JSON.stringify([koodisto, versio]);

  const { data, ...rest } = useApiAsync({
    promiseFn: getKoodistoNimet,
    koodistoUri: koodisto,
    koodistoVersio: versio,
    watch,
  });

  const options = useMemo(
    () => {
      return data ? getOptions({ koodisto: data, language }) : [];
    },
    [data, language],
  );

  return { ...rest, options };
};

export default useKoodistoOptions;
