import React from 'react';

import FormHeader from '../FormHeader';
import { useTranslation } from 'react-i18next';

const CreateSoraKuvausHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.soraKuvaus')}</FormHeader>;
};

export default CreateSoraKuvausHeader;
