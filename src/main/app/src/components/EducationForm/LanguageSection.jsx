import React from 'react';
import { Field } from 'redux-form';

import Checkbox from '../Checkbox';
import Typography from '../Typography';

const renderCheckboxField = ({ input, label }) => (
  <Checkbox {...input}>{label}</Checkbox>
);

const LanguageSection = props => {
  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        Valitse ne kielet, joilla tiedot julkaistaan Opintopolussa
      </Typography>
      <Field name="fi" label="Suomi" component={renderCheckboxField} />
      <Field name="se" label="Ruotsi" component={renderCheckboxField} />
      <Field name="en" label="Englanti" component={renderCheckboxField} />
    </div>
  );
};

export default LanguageSection;
