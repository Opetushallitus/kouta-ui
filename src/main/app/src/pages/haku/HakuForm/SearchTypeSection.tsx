import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { FormFieldRadioGroup } from '#/src/components/formFields';

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
