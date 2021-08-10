import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';

export const NimiSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`nimi.${language}`}
      component={FormFieldInput}
      label={t('yleiset.nimi')}
      required
    />
  );
};
