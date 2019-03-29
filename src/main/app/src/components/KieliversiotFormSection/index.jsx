import React, { useMemo } from 'react';
import { Field } from 'redux-form';

import CheckboxGroup from '../CheckboxGroup';
import Typography from '../Typography';
import useTranslation from '../useTranslation';

const renderCheckboxGroupField = ({ input, ...props }) => (
  <CheckboxGroup {...input} {...props} />
);

const getOptions = t => [
  { value: 'fi', label: t('yleiset.suomi') },
  { value: 'sv', label: t('yleiset.ruotsi') },
  { value: 'en', label: t('yleiset.englanti') },
];

const KieliversionFormSection = props => {
  const { t } = useTranslation();
  const options = useMemo(() => getOptions(t), [t]);

  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        {t('yleiset.valitseKieliversiot')}
      </Typography>
      <Field name="languages" component={renderCheckboxGroupField} options={options} />
    </div>
  );
};

export default KieliversionFormSection;
