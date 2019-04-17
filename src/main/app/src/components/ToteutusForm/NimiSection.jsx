import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldInput } from '../FormFields';

const NimiSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`name.${language}`}
      component={FormFieldInput}
      label={t('yleiset.nimi')}
    />
  );
};

export default NimiSection;
