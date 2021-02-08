import _ from 'lodash';

import tryParseJson from './tryParseJson';

const getUserRoles = user => {
  if (!_.isObject(user) || !user.roles) {
    return [];
  }

  const roles = tryParseJson(user.roles, []);

  return _.isArray(roles) ? roles : [];
};

export default getUserRoles;
