import { useEffect, useState } from 'react';

import useTranslation from '../useTranslation';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(
    () => {
      const callbackFn = lng => {
        setLanguage(lng);
      };

      i18n.on('languageChanged', callbackFn);

      return () => {
        i18n.off('languageChanged', callbackFn);
      };
    },
    [i18n],
  );

  return language;
};

export default useLanguage;
