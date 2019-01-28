import React from 'react';
import createCachedSelector from 're-reselect';
import { FormName, getInitialValues } from 'redux-form';
import { connect } from 'react-redux';

const selectFormInitialValues = createCachedSelector(
  (state, formName) => state,
  (state, formName) => formName,
  (state, formName) => getInitialValues(formName)(state),
)((state, formName) => formName);

const FormInitialValuesBase = connect((state, { form }) => ({
  initialValues: selectFormInitialValues(state, form),
}))(({ initialValues, children }) => children({ initialValues }));

const FormInitialValues = ({ children, ...props }) => (
  <FormName>
    {({ form }) => <FormInitialValuesBase form={form} children={children} />}
  </FormName>
);

export default FormInitialValues;