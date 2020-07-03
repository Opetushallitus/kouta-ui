import React from 'react';
import { Field } from 'redux-form';

import { FormFieldKoulutustyyppiSelect } from '#/src/components/formFields';
import { useTranslation } from 'react-i18next';

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
