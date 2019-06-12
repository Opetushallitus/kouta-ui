import { isArray } from './index';

const getUserRoles = user => {
  if (!user) {
    return [];
  }

  try {
    const roles = JSON.parse(user.roles);

    return isArray(roles) ? roles : [];
  } catch (e) {
    return [];
  }
};

export default getUserRoles;
