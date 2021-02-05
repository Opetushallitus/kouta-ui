import { useMemo } from 'react';

import useKoodi from '#/src/hooks/useKoodi';
import useLanguage from '#/src/hooks/useLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

const useKoodiNimi = (koodiUri, { language: languageOpt } = {}) => {
  const { koodi, ...rest } = useKoodi(koodiUri);
  const language = useLanguage();
  const koodiLanguage = languageOpt || language;

  const nimi = useMemo(() => getKoodiNimiTranslation(koodi, koodiLanguage), [
    koodi,
    koodiLanguage,
  ]);

  return { nimi, ...rest };
};

export default useKoodiNimi;
