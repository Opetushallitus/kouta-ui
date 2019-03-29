import React from 'react';

import FormHeader from '../FormHeader';
import useTranslation from '../useTranslation';

const CreateHakukohdeHeader = () => {
  const { t } = useTranslation();

  return (
    <FormHeader>{t('yleiset.hakukohde')}</FormHeader>
  );
}

export default CreateHakukohdeHeader;
