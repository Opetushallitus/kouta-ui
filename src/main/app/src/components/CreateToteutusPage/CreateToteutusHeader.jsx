import React from 'react';

import FormHeader from '../FormHeader';
import { useTranslation } from 'react-i18next';

const CreateToteutusHeader = () => {
  const { t } = useTranslation();

  return <FormHeader>{t('yleiset.koulutuksenToteutus')}</FormHeader>;
};

export default CreateToteutusHeader;
