import { useMemo } from 'react';

import useKoodit from '#/src/hooks/useKoodit';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

const useKoodiNimet = (koodiUris, language = undefined) => {
  const { koodit, ...rest } = useKoodit(koodiUris);
  const userLanguage = useUserLanguage();

  const nimet = useMemo(() => {
    return koodit.map(koodi => {
      return koodi
        ? getKoodiNimiTranslation(koodi, language ?? userLanguage)
        : undefined;
    });
  }, [userLanguage, language, koodit]);

  return { nimet, ...rest };
};

export default useKoodiNimet;
