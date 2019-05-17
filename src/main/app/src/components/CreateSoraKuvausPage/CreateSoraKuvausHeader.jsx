import React from 'react';

import FormHeader from '../FormHeader';
import useTranslation from '../useTranslation';

const CreateSoraKuvausHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.soraKuvaus')}</FormHeader>;
};

export default CreateSoraKuvausHeader;
