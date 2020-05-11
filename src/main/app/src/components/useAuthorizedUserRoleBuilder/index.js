import { useMemo } from 'react';

import useAuthorizedUser from '../useAuthorizedUser';
import getUserRoles from '../../utils/getUserRoles';
import createRoleBuilder from '../../utils/createRoleBuilder';

export const useAuthorizedUserRoleBuilder = () => {
  const user = useAuthorizedUser();

  const roleBuilder = useMemo(
    () => createRoleBuilder({ roles: getUserRoles(user) }),
    [user]
  );

  return roleBuilder;
};

export default useAuthorizedUserRoleBuilder;
