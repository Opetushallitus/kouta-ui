import { useMemo } from 'react';

import useKoodit from '#/src/hooks/useKoodit';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

const useKoodiNimet = koodiUris => {
  const { koodit, ...rest } = useKoodit(koodiUris);
  const language = useUserLanguage();

  const nimet = useMemo(() => {
    return koodit.map(koodi => {
      return koodi ? getKoodiNimiTranslation(koodi, language) : undefined;
    });
  }, [language, koodit]);

  return { nimet, ...rest };
};

export default useKoodiNimet;
