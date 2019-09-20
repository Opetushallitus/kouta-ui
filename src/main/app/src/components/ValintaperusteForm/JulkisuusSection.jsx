import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldCheckbox } from '../formFields';

export const JulkisuusSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldCheckbox}
      label={t('valintaperustelomake.valitseValintaperusteenNakyminen')}
    >
      {t('valintaperustelomake.valintaperusteOnJulkinen')}
    </Field>
  );
};

export default JulkisuusSection;
