import React from 'react';
import { Field } from 'redux-form';

import { FormFieldKieliversiotSelect } from '../formFields';
import useTranslation from '../useTranslation';

export const KieliversiotSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldKieliversiotSelect}
      label={t('yleiset.valitseKieliversiot')}
    />
  );
};

export default KieliversiotSection;
