import { isArray } from './index';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '../constants';
import getUserRoles from './getUserRoles';

const userHasOrganisaatioRoles = (user, organisaatioOid, roles) => {
  if (!user || !isArray(roles) || !organisaatioOid) {
    return false;
  }

  const userRoles = getUserRoles(user);

  return !roles.find(
    role =>
      !(
        userRoles.includes(`${role}_${organisaatioOid}`) ||
        userRoles.includes(`${role}_${OPETUSHALLITUS_ORGANISAATIO_OID}`)
      ),
  );
};

export default userHasOrganisaatioRoles;
