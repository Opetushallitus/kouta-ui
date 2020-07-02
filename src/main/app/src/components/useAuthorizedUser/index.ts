import { useContext } from 'react';

import AuthorizedUserContext from '../AuthorizedUserContext';

export const useAuthorizedUser = () => {
  return useContext(AuthorizedUserContext);
};

export default useAuthorizedUser;
