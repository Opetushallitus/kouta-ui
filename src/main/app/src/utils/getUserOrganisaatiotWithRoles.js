import { isArray } from 'lodash';
import getUserRoles from './getUserRoles';
import getRoleOrganisaatioOid from './getRoleOrganisaatioOid';

const getUserOrganisaatiotWithRoles = (user, roles) => {
  if (!isArray(roles) || !user) {
    return [];
  }

  const userRoles = getUserRoles(user);

  const organisaatioOids = [];

  for (let role of userRoles) {
    const isMatch = Boolean(roles.find(r => role.startsWith(r)));

    if (!isMatch) {
      continue;
    }

    const oid = getRoleOrganisaatioOid(role);

    if (!oid) {
      continue;
    }

    organisaatioOids.push(oid);
  }

  return organisaatioOids;
};

export default getUserOrganisaatiotWithRoles;
