import React from 'react';
import { Field } from 'redux-form';

import Checkbox from '../Checkbox';

const renderCheckboxField = ({ input: { onChange, value }, label }) => (
  <Checkbox onChange={onChange} checked={value}>
    {label}
  </Checkbox>
);

export const NakyvyysSection = () => (
  <Field name="julkinen" component={renderCheckboxField} label="Koulutus on julkinen" />
);

export default NakyvyysSection;
