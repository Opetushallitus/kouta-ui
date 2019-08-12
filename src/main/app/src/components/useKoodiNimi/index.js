import { useMemo } from 'react';

import getKoodiNimiTranslation from '../../utils/getKoodiNimiTranslation';
import useLanguage from '../useLanguage';
import useKoodi from '../useKoodi';

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
