import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldRadioGroup } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

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
