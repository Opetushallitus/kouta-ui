import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldInput } from '../FormFields';

const NameSection = ({ language, ...props }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`nimi.${language}`}
      component={FormFieldInput}
      label={t('yleiset.nimi')}
    />
  );
};

export default NameSection;
