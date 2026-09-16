import getRoleOrganisaatioOid from './getRoleOrganisaatioOid';
import getUserRoles from './getUserRoles';

const getUserOrganisaatiotWithRoles = (user, roles) => {
  if (!Array.isArray(roles) || !user) {
    return [];
  }

  const userRoles = getUserRoles(user);

  const organisaatioOids = [];

  for (const role of userRoles) {
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
