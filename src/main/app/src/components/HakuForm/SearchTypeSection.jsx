import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import { FormFieldRadioGroup } from '../FormFields';

const TargetGroupSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'hakutapa' });
  const { t } = useTranslation();

  return (
    <Field
      name="tapa"
      component={FormFieldRadioGroup}
      label={t('hakulomake.valitseHakutapa')}
      options={options}
    />
  );
};

export default TargetGroupSection;
