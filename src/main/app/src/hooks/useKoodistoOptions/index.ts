import { useMemo } from 'react';

import _ from 'lodash';

import useKoodisto from '#/src/hooks/useKoodisto';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

const defaultSort = options => {
  const byLabel = ({ label }) => label;
  const byFirstNumber = ({ label }) =>
    /^\d/.test(label) && _.parseInt(label.match(/(\d+)/)?.[0]);
  return _.sortBy(options, [byFirstNumber, byLabel]);
};

type GetOptionsProps = {
  koodisto: Array<Koodi>;
  language: LanguageCode;
  sortFn?: (SelectOptions) => SelectOptions;
  formatLabel?: (any, LanguageCode) => string;
};

const getOptions = ({
  koodisto,
  language,
  sortFn = defaultSort,
  formatLabel,
}: GetOptionsProps) =>
  sortFn(
    _.map(koodisto, koodi => ({
      value: `${koodi?.koodiUri}#${koodi?.versio}`,
      label: _.isFunction(formatLabel)
        ? formatLabel(koodi, language)
        : getKoodiNimiTranslation(koodi, language),
    }))
  );

type UseKoodistoDataOptionsProps = {
  koodistoData: Array<Koodi>;
  language?: LanguageCode;
  sortFn?: (unknown) => SelectOptions;
  formatLabel?: (unknown) => string;
};

export const useKoodistoDataOptions = ({
  koodistoData,
  language,
  sortFn,
  formatLabel,
}: UseKoodistoDataOptionsProps) => {
  const defaultLanguage = useUserLanguage();
  const theLanguage = language ? language : defaultLanguage;
  return useMemo(
    () =>
      koodistoData
        ? getOptions({
            koodisto: koodistoData,
            language: theLanguage,
            sortFn,
            formatLabel,
          })
        : [],
    [koodistoData, theLanguage, sortFn, formatLabel]
  );
};

type UseKoodistoOptionsProps = {
  koodisto: string;
  versio?: number;
  language?: LanguageCode;
  sortFn?: (unknown) => SelectOptions;
};

export const useKoodistoOptions = ({
  koodisto,
  versio,
  language,
  sortFn,
}: UseKoodistoOptionsProps) => {
  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const options = useKoodistoDataOptions({
    koodistoData: data ?? [],
    language,
    sortFn,
  });

  return { ...rest, options };
};

export default useKoodistoOptions;
