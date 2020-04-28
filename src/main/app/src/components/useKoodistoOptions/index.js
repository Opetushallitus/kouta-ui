import { useMemo } from 'react';
import { isArray, mapValues, sortBy } from 'lodash';

import { arrayToTranslationObject, getFirstLanguageValue } from '../../utils';

import useKoodisto from '../useKoodisto';
import useLanguage from '../useLanguage';

const getOptions = ({ koodisto, language, sort = true }) => {
  const nimet = isArray(koodisto)
    ? koodisto.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];

  const options = nimet.map(({ nimi, koodiUri }) => ({
    value: koodiUri,
    label: getFirstLanguageValue(nimi, language),
  }));

  return sort ? sortBy(options, ({ label }) => label) : options;
};

export const useKoodistoOptions = ({
  koodisto,
  versio,
  language: languageProp,
  sort = true,
}) => {
  const translationLanguage = useLanguage();
  const language = languageProp || translationLanguage || 'fi';

  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const options = useMemo(() => {
    return data ? getOptions({ koodisto: data, language, sort }) : [];
  }, [data, language, sort]);

  return { ...rest, options };
};

export default useKoodistoOptions;
