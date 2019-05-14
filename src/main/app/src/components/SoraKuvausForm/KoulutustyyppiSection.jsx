import React from 'react';
import { Field } from 'redux-form';

import { FormFieldKoulutustyyppiSelect } from '../FormFields';
import useTranslation from '../useTranslation';

export const KoulutustyyppiSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldKoulutustyyppiSelect}
      label={t('yleiset.valitseKoulutustyyppi')}
    />
  );
};

export default KoulutustyyppiSection;
