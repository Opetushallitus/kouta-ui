import { useMemo } from 'react';

import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import createRoleBuilder from '#/src/utils/createRoleBuilder';
import getUserRoles from '#/src/utils/getUserRoles';

export const useAuthorizedUserRoleBuilder = () => {
  const user = useAuthorizedUser();

  const roleBuilder = useMemo(
    () => createRoleBuilder({ roles: getUserRoles(user) }),
    [user]
  );

  return roleBuilder;
};

export default useAuthorizedUserRoleBuilder;
