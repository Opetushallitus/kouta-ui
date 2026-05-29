import _ from 'lodash';

type Kayttooikeus = { palvelu: string; oikeus: string };
type OrganisaatioWithRoles = {
  organisaatioOid: string;
  kayttooikeudet: Array<Kayttooikeus>;
};
export type AuthorizedUser = { organisaatiot: Array<OrganisaatioWithRoles> };

const getUserRoles = (
  userdata: AuthorizedUser | null | undefined
): Array<string> => {
  if (!_.isObject(userdata)) {
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
