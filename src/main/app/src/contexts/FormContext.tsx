import React, { useContext } from 'react';

import { ENTITY, FormMode } from '#/src/constants';

type FormContextType = {
  name?: ENTITY;
  disabled?: boolean;
  mode?: FormMode;
};

export const FormContext = React.createContext<FormContextType>({});

FormContext.displayName = 'FormContext';

export const useFormName = () => useContext(FormContext)?.name;
export const useFormIsDisabled = () =>
  useContext(FormContext)?.disabled ?? false;
export const useFormMode = () => useContext(FormContext)?.mode;

export default FormContext;
