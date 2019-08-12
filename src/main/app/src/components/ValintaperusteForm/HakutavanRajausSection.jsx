import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import useKoodistoOptions from '../useKoodistoOptions';
import { FormFieldRadioGroup } from '../FormFields';

const HakutavanRajausSection = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'hakutapa' });

  return (
    <Field
      name={name}
      component={FormFieldRadioGroup}
      options={options}
      label={t('valintaperustelomake.valitseHakutapa')}
    />
  );
};

export default HakutavanRajausSection;
