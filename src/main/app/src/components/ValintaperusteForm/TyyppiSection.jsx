import React from 'react';
import { Field } from 'redux-form';

import KoulutustyyppiSelect from '../KoulutustyyppiSelect';
import { createFormFieldComponent } from '../FormFields';
import useTranslation from '../useTranslation';

const TyyppiField = createFormFieldComponent(
  KoulutustyyppiSelect,
  ({ input, meta, ...props }) => ({
    ...input,
    ...props,
  }),
);

const TyyppiSection = () => {
  const { t } = useTranslation();

  return (
    <Field
      name="tyyppi"
      component={TyyppiField}
      label={t('valintaperustelomake.valitseKoulutustyyppi')}
    />
  );
};

export default TyyppiSection;
