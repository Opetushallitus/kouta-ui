import React from 'react';

import { useContextOrThrow } from '../hooks/useContextOrThrow';

export const AuthorizedUserContext = React.createContext<any>(undefined);
AuthorizedUserContext.displayName = 'AuthorizedUserContext';

export const useAuthorizedUser = () => useContextOrThrow(AuthorizedUserContext);

export default AuthorizedUserContext;
