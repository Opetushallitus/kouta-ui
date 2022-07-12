import React, { useMemo } from 'react';

import { reduxForm } from 'redux-form';

import FormContext from '#/src/contexts/FormContext';

const ReduxFormWrapper = reduxForm({
  initialValues: {},
  enableReinitialize: true,
})(({ children }) => <>{children}</>);

export const ReduxForm = ({
  form,
  mode,
  disabled = false,
  children,
  initialValues,
}) => {
  const formCtx = useMemo(
    () => ({ name: form, disabled, mode }),
    [form, disabled, mode]
  );
  return (
    <ReduxFormWrapper form={form} initialValues={initialValues}>
      <FormContext.Provider value={formCtx}>{children}</FormContext.Provider>
    </ReduxFormWrapper>
  );
};

export default ReduxForm;
