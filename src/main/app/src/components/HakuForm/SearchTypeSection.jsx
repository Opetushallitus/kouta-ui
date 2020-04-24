import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import { useTranslation } from 'react-i18next';
import { FormFieldRadioGroup } from '../formFields';

const TargetGroupSection = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'hakutapa' });
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldRadioGroup}
      label={t('hakulomake.valitseHakutapa')}
      options={options}
    />
  );
};

export default TargetGroupSection;
