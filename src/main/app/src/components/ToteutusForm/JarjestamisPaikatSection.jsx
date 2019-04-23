import React from 'react';
import { Field } from 'redux-form';

import JarjestamisPaikatSelect from './JarjestamisPaikatSelect';
import { createFormFieldComponent } from '../FormFields';

const JarjestamisPaikatField = createFormFieldComponent(
  JarjestamisPaikatSelect,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    ...props,
  }),
);

const JarjestamisPaikatSection = ({ organisaatioOid }) => {
  return (
    <Field
      name="jarjestajat"
      organisaatioOid={organisaatioOid}
      component={JarjestamisPaikatField}
    />
  );
};

export default JarjestamisPaikatSection;
