import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldKieliversiotSelect } from '#/src/components/formFields';

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
