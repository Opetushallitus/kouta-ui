import React from 'react';
import { Field } from 'redux-form';

import KoulutustyyppiSelect from '../KoulutustyyppiSelect';

const renderTypeField = ({ input }) => <KoulutustyyppiSelect {...input} />;

const TyyppiSection = () => {
  return <Field name="tyyppi" component={renderTypeField} />;
};

export default TyyppiSection;
