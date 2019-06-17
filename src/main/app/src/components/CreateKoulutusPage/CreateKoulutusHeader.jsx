import React from 'react';

import FormHeader from '../FormHeader';
import useTranslation from '../useTranslation';

const CreateKoulutusHeader = ({ johtaaTutkintoon = true }) => {
  const { t } = useTranslation();

  return (
    <FormHeader>
      {johtaaTutkintoon
        ? t('yleiset.tutkintoonJohtavaKoulutus')
        : t('yleiset.tutkintoonJohtamatonKoulutus')}
    </FormHeader>
  );
};

export default CreateKoulutusHeader;
