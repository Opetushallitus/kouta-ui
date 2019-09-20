import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import { FormFieldSelect } from '../formFields';

const KohdejoukonRajausSection = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'haunkohdejoukko' });
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldSelect}
      options={options}
      label={t('valintaperustelomake.valitseHaunKohdejoukko')}
    />
  );
};

export default KohdejoukonRajausSection;
