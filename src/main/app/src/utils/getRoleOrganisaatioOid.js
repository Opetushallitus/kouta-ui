import isOid from './isOid';
import { isString } from './index';

const getRoleOrganisaatioOid = role => {
  if (!isString(role)) {
    return undefined;
  }

  const oidStr = role.slice(role.lastIndexOf('_') + 1, role.length);

  return isOid(oidStr) ? oidStr : undefined;
};

export default getRoleOrganisaatioOid;
