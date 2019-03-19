import React from 'react';
import { Field } from 'redux-form';

import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
import Radio, { RadioGroup } from '../Radio';

const renderTypeField = ({ input }) => (
  <RadioGroup {...input}>
    <Radio value={KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS}>
      Ammatillinen koulutus
    </Radio>
    <Radio value={KOULUTUSTYYPPI_CATEGORY.YLIOPISTOKOULUTUS}>
      Yliopistokoulutus
    </Radio>
    <Radio value={KOULUTUSTYYPPI_CATEGORY.AMKKOULUTUS}>
      AMK-koulutus
    </Radio>
  </RadioGroup>
);

const TyyppiSection = () => {
  return <Field name="tyyppi" component={renderTypeField} />;
};

export default TyyppiSection;
