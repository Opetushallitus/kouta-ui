import React, { useMemo } from 'react';

import { reduxForm } from 'redux-form';

import FormContext from '#/src/contexts/FormContext';

const ReduxFormWrapper = reduxForm({
  initialValues: {},
  enableReinitialize: true,
})(({ children }) => <>{children}</>);

const ReduxForm = ({ form, disabled = false, children, initialValues }) => {
  const formCtx = useMemo(() => ({ name: form, disabled }), [form, disabled]);
  return (
    <ReduxFormWrapper form={form} initialValues={initialValues}>
      <FormContext.Provider value={formCtx}>{children}</FormContext.Provider>
    </ReduxFormWrapper>
  );
};

export default ReduxForm;
