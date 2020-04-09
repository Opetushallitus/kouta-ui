import React from 'react';

import FormHeader from '../FormHeader';
import { useTranslation } from 'react-i18next';

const CreateValintaperusteHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.valintaperusteet')}</FormHeader>;
};

export default CreateValintaperusteHeader;
