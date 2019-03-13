import { useMemo } from 'react';
import mapValues from 'lodash/mapValues';
import sortBy from 'lodash/sortBy';

import {
  isArray,
  arrayToTranslationObject,
  getFirstLanguageValue,
} from '../../utils';

import useKoodisto from '../useKoodisto';

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

  return sort ? sortBy(options, ({ value }) => value) : options;
};

export const useKoodistoOptions = ({
  koodisto,
  versio,
  language = 'fi',
  sort = true,
}) => {
  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const options = useMemo(
    () => {
      return data ? getOptions({ koodisto: data, language, sort }) : [];
    },
    [data, language],
  );

  return { ...rest, options };
};

export default useKoodistoOptions;
