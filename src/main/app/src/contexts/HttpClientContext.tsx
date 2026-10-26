import React from 'react';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { HttpClient } from '#/src/httpClient';

export const HttpClientContext = React.createContext<HttpClient | undefined>(
  undefined
);
HttpClientContext.displayName = 'HttpClientContext';

export const useHttpClient = () => useContextOrThrow(HttpClientContext);

export default HttpClientContext;
