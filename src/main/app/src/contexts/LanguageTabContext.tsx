import React from 'react';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';

export const LanguageTabContext = React.createContext<LanguageCode | undefined>(
  undefined
);
LanguageTabContext.displayName = 'LanguageTabContext';

export const useLanguageTab = () => useContextOrThrow(LanguageTabContext);
