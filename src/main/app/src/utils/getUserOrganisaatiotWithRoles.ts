import getRoleOrganisaatioOid from './getRoleOrganisaatioOid';
import getUserRoles, { AuthorizedUser } from './getUserRoles';

const getUserOrganisaatiotWithRoles = (
  user: AuthorizedUser | null | undefined,
  roles: Array<string>
): Array<string> => {
  if (!Array.isArray(roles) || !user) {
    return [];
  }

  const userRoles = getUserRoles(user);

  const organisaatioOids: Array<string> = [];

  for (const role of userRoles) {
    const isMatch = roles.some(r => role.startsWith(r));

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
