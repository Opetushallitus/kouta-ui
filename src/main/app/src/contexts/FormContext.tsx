import React, { useContext } from 'react';

type FormContextType = {
  name?: string;
  disabled?: boolean;
};

export const FormContext = React.createContext<FormContextType>({});

FormContext.displayName = 'FormContext';

export const useFormName = () => useContext(FormContext)?.name;
export const useFormIsDisabled = () => useContext(FormContext)?.disabled;

export default FormContext;
