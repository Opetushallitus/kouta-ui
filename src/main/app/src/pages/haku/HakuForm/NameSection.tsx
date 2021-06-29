import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';

const NameSection = ({ language, name, ...props }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`${name}.${language}`}
      component={FormFieldInput}
      label={t('yleiset.nimi')}
      required
    />
  );
};

export default NameSection;
