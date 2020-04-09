import React from 'react';

import FormHeader from '../FormHeader';
import { useTranslation } from 'react-i18next';

const CreateKoulutusHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.koulutus')}</FormHeader>;
};

export default CreateKoulutusHeader;
