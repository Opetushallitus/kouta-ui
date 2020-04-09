import React from 'react';

import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const Title = ({ children, showPrefix = true }) => {
  const { t } = useTranslation();

  return (
    <Helmet>
      <title>
        {showPrefix ? `${t('sivuTitlet.etuliite')} | ` : ''}
        {children}
      </title>
    </Helmet>
  );
};

export default Title;
