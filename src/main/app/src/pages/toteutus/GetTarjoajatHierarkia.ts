import _fp from 'lodash/fp';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';

const filterByTarjoajat = _fp.curry(
  (tarjoajat, omaOrganisaatioOid, organisaatio) => {
    const checkedOrganisaatioOid = organisaatio.oid;
    return (
      omaOrganisaatioOid === checkedOrganisaatioOid ||
      tarjoajat.includes(checkedOrganisaatioOid)
    );
  }
);

export const GetTarjoajatHierarkia = (organisaatioOid, tarjoajat) => {
  const showAllTarjoajat =
    useIsOphVirkailija() &&
    organisaatioOid !== OPETUSHALLITUS_ORGANISAATIO_OID &&
    Array.isArray(tarjoajat);
  const filterParams = showAllTarjoajat
    ? { filter: filterByTarjoajat(tarjoajat, organisaatioOid) }
    : {};
  const hierarkiaQueryOid = showAllTarjoajat
    ? OPETUSHALLITUS_ORGANISAATIO_OID
    : organisaatioOid;
  return useOrganisaatioHierarkia(hierarkiaQueryOid, filterParams);
};
