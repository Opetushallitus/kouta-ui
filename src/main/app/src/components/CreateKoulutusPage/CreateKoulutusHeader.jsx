import React from 'react';

import FormHeader from '../FormHeader';
import useTranslation from '../useTranslation';

const CreateKoulutusHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.koulutus')}</FormHeader>;
};

export default CreateKoulutusHeader;
