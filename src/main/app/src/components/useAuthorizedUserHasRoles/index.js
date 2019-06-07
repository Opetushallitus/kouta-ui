import { useMemo } from 'react';

import useAuthorizedUser from '../useAuthorizedUser';
import { isArray } from '../../utils';
import getUserRoles from '../../utils/getUserRoles';

const hasAllRoles = (roles, userRoles) => {
  if (!isArray(roles) || !isArray(userRoles)) {
    return false;
  }

  return !roles.find(role => !userRoles.includes(role));
};

export const useAuthorizedUserHasRoles = roles => {
  const user = useAuthorizedUser();

  const userRoles = useMemo(() => getUserRoles(user), [user]);

  const userHasAllRoles = useMemo(() => hasAllRoles(roles, userRoles), [
    roles,
    userRoles,
  ]);

  return userHasAllRoles;
};

export default useAuthorizedUserHasRoles;
