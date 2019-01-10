import React from 'react';
import { Field } from 'redux-form';

import Radio, { RadioGroup } from '../Radio';

const renderTypeField = ({ input }) => (
  <RadioGroup {...input}>
    <Radio value="ammatillinen_koulutus">Ammatillinen koulutus</Radio>
    <Radio value="korkeakoulutus">Korkeakoulutus</Radio>
    <Radio value="lukiokoulutus">Lukiokoulutus</Radio>
  </RadioGroup>
);

const TypeSection = props => {
  return <Field name="type" component={renderTypeField} />;
};

export default TypeSection;
