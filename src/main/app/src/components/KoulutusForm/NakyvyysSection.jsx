import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldCheckbox } from '../formFields';

export const NakyvyysSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field name={name} component={FormFieldCheckbox}>
      {t('koulutuslomake.koulutusOnJulkinen')}
    </Field>
  );
};

export default NakyvyysSection;
