import React from 'react';

import FormHeader from '../FormHeader';
import useTranslation from '../useTranslation';

const CreateValintaperusteHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.valintaperusteet')}</FormHeader>;
};

export default CreateValintaperusteHeader;
