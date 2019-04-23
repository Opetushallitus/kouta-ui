import React, { useMemo } from 'react';
import { Field } from 'redux-form';

import { FormFieldCheckboxGroup } from '../FormFields';
import useTranslation from '../useTranslation';

const getOptions = t => [
  { value: 'fi', label: t('yleiset.suomi') },
  { value: 'sv', label: t('yleiset.ruotsi') },
  { value: 'en', label: t('yleiset.englanti') },
];

const KieliversionFormSection = props => {
  const { t } = useTranslation();
  const options = useMemo(() => getOptions(t), [t]);

  return (
    <Field
      name="languages"
      component={FormFieldCheckboxGroup}
      options={options}
      label={t('yleiset.valitseKieliversiot')}
    />
  );
};

export default KieliversionFormSection;
