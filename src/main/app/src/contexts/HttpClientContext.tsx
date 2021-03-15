import React from 'react';

import { AxiosInstance } from 'axios';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';

export const HttpClientContext = React.createContext<AxiosInstance | undefined>(
  undefined
);
HttpClientContext.displayName = 'HttpClientContext';

export const useHttpClient = () => useContextOrThrow(HttpClientContext);

export default HttpClientContext;
