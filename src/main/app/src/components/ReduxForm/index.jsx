import React from 'react';
import { reduxForm } from 'redux-form';

import FormNameContext from '../FormNameContext';

const ReduxForm = reduxForm({ initialValues: {} })(
  ({ children, form, ...props }) => {
    return (
      <FormNameContext.Provider value={form}>
        {children({ form, ...props })}
      </FormNameContext.Provider>
    );
  },
);

export default ReduxForm;
