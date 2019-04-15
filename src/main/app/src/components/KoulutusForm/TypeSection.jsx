import React from 'react';
import { Field } from 'redux-form';

import KoulutustyyppiSelect from '../KoulutustyyppiSelect';
import { createFormFieldComponent } from '../FormFields';
import { useTranslation } from '../useTranslation';

const TyyppiField = createFormFieldComponent(
  KoulutustyyppiSelect,
  ({ input, meta, ...props }) => {
    return {
      ...input,
      ...props,
    };
  },
);

const TypeSection = () => {
  const { t } = useTranslation();

  return (
    <Field
      name="type"
      component={TyyppiField}
      label={t('koulutuslomake.valitseKoulutustyyppi')}
    />
  );
};

export default TypeSection;
