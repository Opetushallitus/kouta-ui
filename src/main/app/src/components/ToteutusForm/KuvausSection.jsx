import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldTextarea } from '../formFields';

const KuvausSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`${name}.${language}`}
      component={FormFieldTextarea}
      label={t('yleiset.kuvaus')}
    />
  );
};

export default KuvausSection;
