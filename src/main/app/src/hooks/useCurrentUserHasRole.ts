import _ from 'lodash';
import { useMemo } from 'react';
import useOrganisaatio from '../components/useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../components/useAuthorizedUserRoleBuilder';
import { ENTITY_ROLES, CRUD_ROLES } from '../constants';

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
