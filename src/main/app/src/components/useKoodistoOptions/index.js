import { useMemo } from 'react';
import { isArray, mapValues, first, orderBy } from 'lodash';

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

  const byLabel = ({ label }) => label;
  const byFirstNumber = ({ label }) =>
    /^\d/.test(label) && parseInt(first(label.match(/(\d+)/)));

  return sort ? orderBy(options, [byFirstNumber, byLabel]) : options;
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
