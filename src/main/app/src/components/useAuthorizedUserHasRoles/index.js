import { useMemo } from 'react';

import useAuthorizedUser from '../useAuthorizedUser';
import { isArray } from '../../utils';

const getRoles = user => {
  if (!user) {
    return [];
  }

  try {
    const roles = JSON.parse(user.roles);

    return isArray(roles) ? roles : [];
  } catch (e) {
    return [];
  }
};

const hasAllRoles = (roles, userRoles) => {
  if (!isArray(roles) || !isArray(userRoles)) {
    return false;
  }

  return !roles.find(role => !userRoles.includes(role));
};

export const useAuthorizedUserHasRoles = roles => {
  const user = useAuthorizedUser();

  const userRoles = useMemo(() => getRoles(user), [user]);

  const userHasAllRoles = useMemo(() => hasAllRoles(roles, userRoles), [
    roles,
    userRoles,
  ]);

  return userHasAllRoles;
};

export default useAuthorizedUserHasRoles;
