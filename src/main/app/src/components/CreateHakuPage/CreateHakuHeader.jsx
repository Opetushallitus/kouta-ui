import React from 'react';

import FormHeader from '../FormHeader';
import { useTranslation } from 'react-i18next';

const CreateHakuHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.haku')}</FormHeader>;
};

export default CreateHakuHeader;
