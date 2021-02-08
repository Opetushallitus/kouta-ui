import _ from 'lodash';

import isOid from './isOid';

const getRoleOrganisaatioOid = role => {
  if (!_.isString(role)) {
    return undefined;
  }

  const oidStr = role.slice(role.lastIndexOf('_') + 1, role.length);

  return isOid(oidStr) ? oidStr : undefined;
};

export default getRoleOrganisaatioOid;
