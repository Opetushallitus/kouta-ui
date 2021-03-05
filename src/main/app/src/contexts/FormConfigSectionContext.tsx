import React from 'react';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';

export const FormConfigSectionContext = React.createContext<string | undefined>(
  undefined
);
FormConfigSectionContext.displayName = 'FormConfigSectionContext';

export default FormConfigSectionContext;

export const useFormConfigSection = () =>
  useContextOrThrow(FormConfigSectionContext);
