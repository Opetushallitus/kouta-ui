import { OPETUSHALLITUS_ORGANISAATIO_OID } from '../constants';

const isOphOrganisaatio = oid => {
  return oid === OPETUSHALLITUS_ORGANISAATIO_OID;
};

export default isOphOrganisaatio;
