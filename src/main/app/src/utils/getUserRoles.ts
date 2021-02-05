import { isArray, isObject } from 'lodash';

import tryParseJson from './tryParseJson';

const getUserRoles = user => {
  if (!isObject(user) || !user.roles) {
    return [];
  }

  const roles = tryParseJson(user.roles, []);

  return isArray(roles) ? roles : [];
};

export default getUserRoles;
