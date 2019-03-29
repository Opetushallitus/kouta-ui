import React from 'react';
import { Field } from 'redux-form';

import KoulutustyyppiSelect from '../KoulutustyyppiSelect';

const renderTypeField = ({ input }) => <KoulutustyyppiSelect {...input} />;

const TypeSection = () => {
  return <Field name="type" component={renderTypeField} />;
};

export default TypeSection;
