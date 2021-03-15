import React from 'react';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';

const UrlContext = React.createContext<Record<string, string> | undefined>(
  undefined
);
UrlContext.displayName = 'UrlContext';

export const useUrls = () => useContextOrThrow(UrlContext);

export default UrlContext;
