import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldTextarea } from '../FormFields';

const KuvausSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`kuvaus.${language}`}
      component={FormFieldTextarea}
      label={t('yleiset.kuvaus')}
    />
  );
};

export default KuvausSection;
