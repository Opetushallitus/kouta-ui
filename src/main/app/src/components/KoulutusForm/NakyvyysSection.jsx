import React from 'react';
import { Field } from 'redux-form';

import { useTranslation } from 'react-i18next';
import { FormFieldCheckbox } from '../formFields';

export const NakyvyysSection = ({ disabled, name }) => {
  const { t } = useTranslation();

  return (
    <Field disabled={disabled} name={name} component={FormFieldCheckbox}>
      {t('koulutuslomake.koulutusOnJulkinen')}
    </Field>
  );
};

export default NakyvyysSection;
