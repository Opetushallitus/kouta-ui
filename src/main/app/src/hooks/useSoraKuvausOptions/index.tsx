import { useMemo } from 'react';
import { isArray } from 'lodash';
import useSoraKuvaukset from '#/src/hooks/useSoraKuvaukset';
import useLanguage from '#/src/hooks/useLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { useTranslation } from 'react-i18next';
import { getJulkaisutilaTranslationKey } from '#/src/constants';

export const useSoraKuvausOptions = args => {
  const { soraKuvaukset, ...rest } = useSoraKuvaukset(args);
  const language = useLanguage();
  const { t } = useTranslation();

  const options = useMemo(() => {
    return isArray(soraKuvaukset)
      ? soraKuvaukset.map(({ id, nimi, tila }) => ({
          value: id,
          label:
            getFirstLanguageValue(nimi, language) +
            ` (${t(getJulkaisutilaTranslationKey(tila))})`,
        }))
      : [];
  }, [soraKuvaukset, language, t]);

  return { options, ...rest };
};

export default useSoraKuvausOptions;
