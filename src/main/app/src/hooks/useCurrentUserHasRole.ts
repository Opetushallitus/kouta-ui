import _ from 'lodash/fp';
import { useCallback, useMemo } from 'react';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { ENTITY_ROLES, CRUD_ROLES } from '#/src/constants';

export const useGetCurrentUserHasRole = (entity, role = CRUD_ROLES.READ) => {
  const roleBuilder = useAuthorizedUserRoleBuilder();

  return useCallback(
    organisaatio =>
      roleBuilder[`has${_.upperFirst(role)}`](
        ENTITY_ROLES[entity],
        organisaatio
      ).result(),
    [entity, role, roleBuilder]
  );
};

export const useCurrentUserHasRole = (
  entity,
  role = CRUD_ROLES.READ,
  organisaatioOid
) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const getCurrentUserHasRole = useGetCurrentUserHasRole(entity, role);

  return useMemo(() => getCurrentUserHasRole(organisaatio), [
    getCurrentUserHasRole,
    organisaatio,
  ]);
};
