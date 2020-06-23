import React from 'react';
import { reduxForm } from 'redux-form';
import FormNameContext from '../FormNameContext';

const ReduxForm = reduxForm({ initialValues: {}, enableReinitialize: true })(
  ({ children, form }) => {
    return (
      <FormNameContext.Provider value={form}>
        {children}
      </FormNameContext.Provider>
    );
  }
);

export default ReduxForm;
