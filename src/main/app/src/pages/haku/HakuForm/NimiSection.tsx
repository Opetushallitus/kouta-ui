import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldInput } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';

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
