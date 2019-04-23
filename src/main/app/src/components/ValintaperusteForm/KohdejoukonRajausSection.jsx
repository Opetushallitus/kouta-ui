import React from 'react';
import { Field } from 'redux-form';
 
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import { FormFieldSelect } from '../FormFields';

const KohdejoukonRajausSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'haunkohdejoukko' });
  const { t } = useTranslation();

  return (
    <Field
      name="kohdejoukko"
      component={FormFieldSelect}
      options={options}
      label={t('valintaperustelomake.valitseHaunKohdejoukko')}
    />
  );
};

export default KohdejoukonRajausSection;
