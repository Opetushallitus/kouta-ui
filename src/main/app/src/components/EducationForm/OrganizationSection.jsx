import React from 'react';
import { Field } from 'redux-form';

import Checkbox from '../Checkbox';
import Typography from '../Typography';

const renderCheckboxField = ({ input, label }) => (
  <Checkbox {...input}>{label}</Checkbox>
);

const OrganizationSection = props => {
  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        Valitse ne organisaatiot, jotka järjestävät koulutusta
      </Typography>
      <Field
        name="organization_1"
        label="Organization 1"
        component={renderCheckboxField}
      />
    </div>
  );
};

export default OrganizationSection;
