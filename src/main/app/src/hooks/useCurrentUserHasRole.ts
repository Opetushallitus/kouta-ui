import _ from 'lodash';
import { useMemo } from 'react';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { ENTITY_ROLES, CRUD_ROLES } from '#/src/constants';

export const useCurrentUserHasRole = (
  entity,
  role = CRUD_ROLES.READ,
  organisaatioOid
) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  return useMemo(
    () =>
      roleBuilder[`has${_.upperFirst(role)}`](
        ENTITY_ROLES[entity],
        organisaatio
      ).result(),
    [entity, organisaatio, role, roleBuilder]
  );
};
