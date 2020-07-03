import { useMemo } from 'react';

import useAuthorizedUser from '#/src/hooks/useAuthorizedUser';
import getUserRoles from '#/src/utils/getUserRoles';
import createRoleBuilder from '#/src/utils/createRoleBuilder';

export const useAuthorizedUserRoleBuilder = () => {
  const user = useAuthorizedUser();

  const roleBuilder = useMemo(
    () => createRoleBuilder({ roles: getUserRoles(user) }),
    [user]
  );

  return roleBuilder;
};

export default useAuthorizedUserRoleBuilder;
