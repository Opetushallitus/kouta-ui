import React from 'react';
import { useTitle } from 'react-use';
import { useTranslation } from 'react-i18next';

const Title = ({ children, showPrefix = true }) => {
  const { t } = useTranslation();
  const prefix = showPrefix ? `${t('sivuTitlet.etuliite')} | ` : '';
  useTitle(`${prefix}${children}`);
  return <></>;
};

export default Title;
