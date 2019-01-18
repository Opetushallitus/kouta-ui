import React from 'react';
import { Field } from 'redux-form';

import JarjestamisPaikatSelect from './JarjestamisPaikatSelect';

const renderJarjestamisPaikatSelectField = ({ input, organisaatioOid }) => {
  const { onChange, value } = input;

  return <JarjestamisPaikatSelect onChange={onChange} value={value || []} organisaatioOid={organisaatioOid} />
};

const JarjestamisPaikatSection = ({ organisaatioOid }) => {
  return <Field name="jarjestajat" organisaatioOid={organisaatioOid} component={renderJarjestamisPaikatSelectField} />
};

export default JarjestamisPaikatSection;