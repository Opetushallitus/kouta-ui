import _ from 'lodash';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';

const filterByOids = oids => organisaatio => oids.includes(organisaatio?.oid);

export const useTarjoajatHierarkia = (organisaatioOid, tarjoajat) => {
  const isTarjoajatIncluded =
    useIsOphVirkailija() &&
    organisaatioOid !== OPETUSHALLITUS_ORGANISAATIO_OID &&
    Array.isArray(tarjoajat) &&
    !_.isEmpty(tarjoajat);

  return useOrganisaatioHierarkia(
    isTarjoajatIncluded ? OPETUSHALLITUS_ORGANISAATIO_OID : organisaatioOid,
    isTarjoajatIncluded
      ? { filter: filterByOids([...tarjoajat, organisaatioOid]) }
      : {}
  );
};
