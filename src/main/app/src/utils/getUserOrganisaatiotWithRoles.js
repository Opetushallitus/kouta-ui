import getUserRoles from './getUserRoles';
import isOid from './isOid';
import { isArray, isString } from './index';

const getRoleOrganisaatioOid = role => {
  if (!isString(role)) {
    return undefined;
  }

  const oidStr = role.slice(role.lastIndexOf('_') + 1, role.length);

  return isOid(oidStr) ? oidStr : undefined;
};

const getUserOrganisaatiotWithRoles = (user, roles) => {
  if (!isArray(roles) || !user) {
    return [];
  }

  const userRoles = getUserRoles(user);

  return userRoles
    .map(role => {
      const isMatch = Boolean(roles.find(r => role.startsWith(r)));

      if (!isMatch) {
        return undefined;
      }

      return getRoleOrganisaatioOid(role);
    })
    .filter(Boolean);
};

export default getUserOrganisaatiotWithRoles;
