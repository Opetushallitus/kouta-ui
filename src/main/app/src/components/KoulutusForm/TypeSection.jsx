import React from 'react';
import { Field } from 'redux-form';

import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
import Radio, { RadioGroup } from '../Radio';

const renderTypeField = ({ input, disabled }) => (
  <RadioGroup {...input} disabled={disabled}>
    <Radio value={KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS}>
      Ammatillinen koulutus
    </Radio>
    <Radio value={KOULUTUSTYYPPI_CATEGORY.KORKEAKOULUKOULUTUS}>
      Korkeakoulutus
    </Radio>
    <Radio value={KOULUTUSTYYPPI_CATEGORY.LUKIOKOULUTUS}>Lukiokoulutus</Radio>
  </RadioGroup>
);

const TypeSection = ({ disabled }) => {
  return <Field name="type" component={renderTypeField} disabled={disabled} />;
};

export default TypeSection;
