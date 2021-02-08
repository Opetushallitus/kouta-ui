import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createFormFieldComponent } from '#/src/components/formFields';
import KoulutustyyppiSelect from '#/src/components/KoulutustyyppiSelect';

const TyyppiField = createFormFieldComponent(
  KoulutustyyppiSelect,
  ({ input, meta, ...props }) => {
    return {
      ...input,
      ...props,
    };
  }
);

const TypeSection = ({ johtaaTutkintoon, name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={TyyppiField}
      label={t('yleiset.valitseKoulutustyyppi')}
      johtaaTutkintoon={johtaaTutkintoon}
    />
  );
};

export default TypeSection;
