import { useTranslation as _useTranslation } from 'react-i18next';

export const useTranslation = (key, options = {}) => {
  return _useTranslation(key, { useSuspense: false, ...options });
};

export default useTranslation;
