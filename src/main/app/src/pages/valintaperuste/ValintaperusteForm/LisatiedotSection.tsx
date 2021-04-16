import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor } from '#/src/components/formFields';
import { Spacing } from '#/src/components/Spacing';

export const LisatiedotSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <Spacing marginBottom={2}>
      <Field
        name={`${name}.${language}`}
        component={FormFieldEditor}
        label={t('valintaperustelomake.lisatiedot')}
      />
    </Spacing>
  );
};
