import React, { useContext } from 'react';

export const FormNameContext = React.createContext<string>('__NO_FORM_NAME__');

FormNameContext.displayName = 'FormNameContext';

export const useFormName = () => useContext(FormNameContext);

export default FormNameContext;
