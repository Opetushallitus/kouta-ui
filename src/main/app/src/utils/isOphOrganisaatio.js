import { OPETUSHALLITUS_ORGANISAATIO_OID } from '../constants';

const isOphOrganisaatio = oid => {
  return OPETUSHALLITUS_ORGANISAATIO_OID === oid;
};

export default isOphOrganisaatio;
