import React, { useMemo } from 'react';

import { reduxForm, InjectedFormProps, ConfigProps } from 'redux-form';

import { ENTITY, FormMode } from '#/src/constants';
import FormContext from '#/src/contexts/FormContext';

interface FormWrapperProps {
  children?: React.ReactNode;
}

const ReduxFormWrapper = reduxForm({
  initialValues: {},
  enableReinitialize: true,
})(({ children }: FormWrapperProps & InjectedFormProps) => (
  <>{children}</>
)) as React.ComponentType<ConfigProps<any> & { children?: React.ReactNode }>;

interface ReduxFormProps {
  form: ENTITY;
  mode?: FormMode;
  disabled?: boolean;
  children: React.ReactNode;
  initialValues: any;
}

export const ReduxForm = ({
  form,
  mode,
  disabled = false,
  children,
  initialValues,
}: ReduxFormProps) => {
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
