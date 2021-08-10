import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { UlkoinenTunniste } from '#/src/components/UlkoinenTunniste';

export const TunnistetiedotSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <>
      <UlkoinenTunniste />
      <Field
        name={`nimi.${language}`}
        component={FormFieldInput}
        label={t('yleiset.nimi')}
        required
      />
    </>
  );
};
