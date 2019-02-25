import React from 'react';
import { Field } from 'redux-form';

import CheckboxGroup from '../CheckboxGroup';
import Typography from '../Typography';

const renderCheckboxGroupField = ({ input, disabled, ...props }) => (
  <CheckboxGroup {...input} disabled={disabled} {...props} />
);

const options = [
  { value: 'fi', label: 'Suomi' },
  { value: 'sv', label: 'Ruotsi' },
  { value: 'en', label: 'Englanti' },
];

const KieliversionFormSection = ({ disabled = false, ...props }) => {
  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        Valitse ne kielet, joilla tiedot julkaistaan Opintopolussa
      </Typography>
      <Field name="languages" component={renderCheckboxGroupField} options={options} disabled={disabled} />
    </div>
  );
};

export default KieliversionFormSection;
