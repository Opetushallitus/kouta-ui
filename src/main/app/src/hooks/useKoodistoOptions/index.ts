import { useMemo } from 'react';

import _ from 'lodash';

import useKoodisto from '#/src/hooks/useKoodisto';
import useLanguage from '#/src/hooks/useLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

const defaultSort = options => {
  const byLabel = ({ label }) => label;
  const byFirstNumber = ({ label }) =>
    /^\d/.test(label) && _.parseInt(label.match(/(\d+)/)?.[0]);
  return _.orderBy(options, [byFirstNumber, byLabel]);
};

type GetOptionsProps = {
  koodisto: Array<Koodi>;
  language: LanguageCode;
  sortFn?: (SelectOptions) => SelectOptions;
};

const getOptions = ({
  koodisto,
  language,
  sortFn = defaultSort,
}: GetOptionsProps) =>
  sortFn(
    _.map(koodisto, koodi => ({
      value: `${koodi?.koodiUri}#${koodi?.versio}`,
      label: getKoodiNimiTranslation(koodi, language),
    }))
  );

export const useKoodistoDataOptions = ({
  koodistoData,
  language,
  sortFn = undefined,
}) => {
  return useMemo(
    () => getOptions({ koodisto: koodistoData, language, sortFn }),
    [koodistoData, language, sortFn]
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
