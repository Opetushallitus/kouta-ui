import { isObject } from 'lodash';

const getUserRoles = userdata => {
  if (!isObject(userdata)) {
    return [];
  }
  const roleSet: Set<string> = new Set();
  userdata.organisaatiot.forEach(({ organisaatioOid, kayttooikeudet }) => {
    kayttooikeudet.forEach(({ palvelu, oikeus }) => {
      roleSet.add(`APP_${palvelu}`);
      roleSet.add(`APP_${palvelu}_${oikeus}`);
      roleSet.add(`APP_${palvelu}_${oikeus}_${organisaatioOid}`);
    });
  });
  const roles = Array.from(roleSet);
  return Array.isArray(roles) ? roles : [];
};

export default getUserRoles;
