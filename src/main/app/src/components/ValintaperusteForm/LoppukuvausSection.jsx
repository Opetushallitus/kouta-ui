import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../useTranslation';
import { FormFieldEditor } from '../FormFields';

const LoppukuvausSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`kuvaus.${language}`}
      component={FormFieldEditor}
      label={t('yleiset.kuvaus')}
    />
  );
};

export default LoppukuvausSection;
