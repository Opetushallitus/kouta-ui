import { useMemo } from 'react';
import { isArray, mapValues, first, orderBy } from 'lodash';

import {
  arrayToTranslationObject,
  getFirstLanguageValue,
} from '#/src/utils/languageUtils';

import useKoodisto from '#/src/hooks/useKoodisto';
import useLanguage from '#/src/hooks/useLanguage';

const getOptions = ({ koodisto, language, sort = true }) => {
  const nimet = isArray(koodisto)
    ? koodisto.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];

  return nimet.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi, language),
  }));
};

const defaultSort = options => {
  const byLabel = ({ label }) => label;
  const byFirstNumber = ({ label }) =>
    /^\d/.test(label) && parseInt(first(label.match(/(\d+)/)));
  return orderBy(options, [byFirstNumber, byLabel]);
};

export const useKoodistoOptions = ({
  koodisto,
  versio = undefined,
  language: languageProp = undefined,
  sortFn = defaultSort,
  sort = true,
}) => {
  const translationLanguage = useLanguage();
  const language = languageProp || translationLanguage || 'fi';

  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const identity = i => i;

  const options = useMemo(() => {
    return data
      ? (sort ? sortFn : identity)(getOptions({ koodisto: data, language }))
      : [];
  }, [data, language, sort, sortFn]);

  return { ...rest, options };
};

export default useKoodistoOptions;
