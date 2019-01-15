import React from 'react';
import { Field } from 'redux-form';

import Checkbox from '../Checkbox';
import Typography from '../Typography';

const makeOnCheckboxChange = ({ value, onChange, optionValue }) => e => {
  if (e.target.checked) {
    onChange([...value, optionValue]);
  } else {
    onChange(value.filter(v => v !== optionValue));
  }
};

const OrganizationSelection = ({ value = [], onChange, options = [] }) => {
  return (
    <>
      {options.map(({ value: optionValue, label }) => (
        <Checkbox
          key={optionValue}
          checked={value.includes(optionValue)}
          onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
        >
          {label}
        </Checkbox>
      ))}
    </>
  );
};

const renderOrganizationSelectionField = ({ input, options }) => (
  <OrganizationSelection {...input} options={options} />
);

const OrganizationSection = props => {
  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        Valitse ne organisaatiot, jotka järjestävät koulutusta
      </Typography>
      <Field
        name="organizations"
        options={[
          { label: 'Organisaatio 1', value: '1.2.246.562.24.62301161440' },
        ]}
        component={renderOrganizationSelectionField}
      />
    </div>
  );
};

export default OrganizationSection;
