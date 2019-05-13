import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldCheckbox } from '../FormFields';

export const NakyvyysSection = () => {
  const { t } = useTranslation();

  return (
    <Field name="julkinen" component={FormFieldCheckbox}>
      {t('koulutuslomake.koulutusOnJulkinen')}
    </Field>
  );
};

export default NakyvyysSection;
