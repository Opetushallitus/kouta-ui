import { useContext } from 'react';

import AuthorizedUserContext from '#/src/contexts/AuthorizedUserContext';

export const useAuthorizedUser = () => {
  return useContext(AuthorizedUserContext);
};

export default useAuthorizedUser;
