import _ from 'lodash';

import tryParseJson from './tryParseJson';

const getUserRoles = userdata => {
  console.log('getUserRoles user = ', userdata);
  if (!_.isObject(userdata)) {
    return [];
  }
  const roles = tryParseJson(userdata, []);
  return _.isArray(roles) ? roles : [];
};

export default getUserRoles;
