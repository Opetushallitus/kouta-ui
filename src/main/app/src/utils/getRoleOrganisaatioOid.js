import isOid from './isOid';
import { isString } from 'lodash';

const getRoleOrganisaatioOid = role => {
  if (!isString(role)) {
    return undefined;
  }

  const oidStr = role.slice(role.lastIndexOf('_') + 1, role.length);

  return isOid(oidStr) ? oidStr : undefined;
};

export default getRoleOrganisaatioOid;
