import React, { useContext } from 'react';

export const KoodistoversiotContext = React.createContext<
  Record<string, string>
>({});

KoodistoversiotContext.displayName = 'KoodistoVersiotContext';

export const useKoodistoVersiot = () => useContext(KoodistoversiotContext);

export default KoodistoversiotContext;
