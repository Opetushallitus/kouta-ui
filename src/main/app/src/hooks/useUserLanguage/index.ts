import { useTranslation } from 'react-i18next';

export const useUserLanguage = () => {
  const { i18n } = useTranslation();

  return i18n.language as LanguageCode;
};
