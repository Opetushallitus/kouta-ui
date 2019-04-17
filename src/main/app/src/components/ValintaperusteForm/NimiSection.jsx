import React from 'react';
import { Field } from 'redux-form';

import { FormFieldInput } from '../FormFields';
import useTranslation from '../useTranslation';

const NimiSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`nimi.${language}`}
      component={FormFieldInput}
      label={t('yleiset.nimi')}
    />
  );
};

export default NimiSection;
