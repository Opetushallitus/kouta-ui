import { useMemo } from 'react';

import useKoodi from '#/src/hooks/useKoodi';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

export const useKoodiNimi = (koodiUri, { language: languageOpt } = {}) => {
  const { koodi, ...rest } = useKoodi(koodiUri);
  const language = useUserLanguage();
  const koodiLanguage = languageOpt || language;

  const nimi = useMemo(
    () => getKoodiNimiTranslation(koodi, koodiLanguage),
    [koodi, koodiLanguage]
  );

  return { nimi, ...rest };
};

export default useKoodiNimi;
