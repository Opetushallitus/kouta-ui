import React from 'react';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';

import { ApiUrls } from '../urls';

const UrlContext = React.createContext<ApiUrls | undefined>(undefined);
UrlContext.displayName = 'UrlContext';

export const useUrls = () => useContextOrThrow(UrlContext);

export default UrlContext;
