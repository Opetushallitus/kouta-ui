import React from 'react';

import FormHeader from '../FormHeader';
import useTranslation from '../useTranslation';

const CreateHakuHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.haku')}</FormHeader>;
};

export default CreateHakuHeader;
