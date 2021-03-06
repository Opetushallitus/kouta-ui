import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldCheckboxGroup } from '#/src/components/formFields';

const getOptions = t => [
  { value: 'fi', label: t('yleiset.suomi') },
  { value: 'sv', label: t('yleiset.ruotsi') },
  { value: 'en', label: t('yleiset.englanti') },
];

export const KieliversiotFields = ({ name = 'kieliversiot', ...props }) => {
  const { t } = useTranslation();
  const options = useMemo(() => getOptions(t), [t]);

  return (
    <Field
      name={name}
      required
      component={FormFieldCheckboxGroup}
      options={options}
      label={t('yleiset.valitseKieliversiot')}
      {...props}
    />
  );
};

export default KieliversiotFields;
