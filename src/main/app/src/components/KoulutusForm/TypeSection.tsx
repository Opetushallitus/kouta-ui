import React from 'react';
import { Field } from 'redux-form';

import KoulutustyyppiSelect from '../KoulutustyyppiSelect';
import { createFormFieldComponent } from '../formFields';
import { useTranslation } from 'react-i18next';

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
      label={t('koulutuslomake.valitseKoulutustyyppi')}
      johtaaTutkintoon={johtaaTutkintoon}
    />
  );
};

export default TypeSection;
