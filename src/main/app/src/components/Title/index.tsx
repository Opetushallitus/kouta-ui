import React from 'react';

import { useTranslation } from 'react-i18next';
import { useTitle } from 'react-use';

const Title = ({ children, showPrefix = true }) => {
  const { t } = useTranslation();
  const prefix = showPrefix ? `${t('sivuTitlet.etuliite')} | ` : '';
  useTitle(`${prefix}${children}`);
  return <></>;
};

export default Title;
