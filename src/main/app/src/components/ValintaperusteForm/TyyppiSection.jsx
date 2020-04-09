import React from 'react';
import { Field } from 'redux-form';

import KoulutustyyppiSelect from '../KoulutustyyppiSelect';
import { createFormFieldComponent } from '../formFields';
import { useTranslation } from 'react-i18next';

const TyyppiField = createFormFieldComponent(
  KoulutustyyppiSelect,
  ({ input, meta, ...props }) => ({
    ...input,
    ...props,
  }),
);

const TyyppiSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={TyyppiField}
      label={t('valintaperustelomake.valitseKoulutustyyppi')}
    />
  );
};

export default TyyppiSection;
