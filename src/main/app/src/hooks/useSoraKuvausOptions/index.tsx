import { useMemo } from 'react';
import { isArray } from 'lodash';
import useSoraKuvaukset from '#/src/hooks/useSoraKuvaukset';
import useLanguage from '#/src/hooks/useLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

export const useSoraKuvausOptions = args => {
  const { soraKuvaukset, ...rest } = useSoraKuvaukset(args);
  const language = useLanguage();

  const options = useMemo(() => {
    return isArray(soraKuvaukset)
      ? soraKuvaukset.map(({ id, nimi }) => ({
          value: id,
          label: getFirstLanguageValue(nimi, language),
        }))
      : [];
  }, [soraKuvaukset, language]);

  return { options, ...rest };
};

export default useSoraKuvausOptions;
