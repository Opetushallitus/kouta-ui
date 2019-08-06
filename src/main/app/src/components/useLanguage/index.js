import useTranslation from '../useTranslation';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  return i18n.language;
};

export default useLanguage;
