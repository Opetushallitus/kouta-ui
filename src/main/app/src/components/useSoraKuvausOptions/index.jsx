import { useMemo } from 'react';

import useSoraKuvaukset from '../useSoraKuvaukset';
import useLanguage from '../useLanguage';
import { getFirstLanguageValue } from '../../utils';

export const useSoraKuvausOptions = args => {
  const { soraKuvaukset, ...rest } = useSoraKuvaukset(args);
  const language = useLanguage();

  const options = useMemo(() => {
    return soraKuvaukset
      ? soraKuvaukset.map(({ id, nimi }) => ({
          value: id,
          label: getFirstLanguageValue(nimi, language),
        }))
      : [];
  }, [soraKuvaukset, language]);

  return { options, ...rest };
};

export default useSoraKuvausOptions;
