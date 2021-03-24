import { useMemo } from 'react';

import _ from 'lodash';

import useKoodisto from '#/src/hooks/useKoodisto';
import useLanguage from '#/src/hooks/useLanguage';
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

export const useKoodistoDataOptions = ({
  koodistoData,
  language,
  sortFn = undefined,
  formatLabel = undefined,
}) => {
  return useMemo(
    () =>
      koodistoData
        ? getOptions({ koodisto: koodistoData, language, sortFn, formatLabel })
        : [],
    [koodistoData, language, sortFn, formatLabel]
  );
};

export const useKoodistoOptions = ({
  koodisto,
  versio = undefined,
  language: languageProp = undefined,
  sortFn = undefined,
  sort = true,
}) => {
  const translationLanguage = useLanguage();
  const language = languageProp || translationLanguage || 'fi';

  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const options = useKoodistoDataOptions({
    koodistoData: data,
    language,
    sortFn,
  });

  return { ...rest, options };
};

export default useKoodistoOptions;
