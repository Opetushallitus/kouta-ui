import _ from 'lodash';

import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  VALINTAPERUSTE_ROLE,
  HAKUKOHDE_ROLE,
  OPPILAITOS_ROLE,
  ORGANISAATIOTYYPPI,
} from '#/src/constants';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const parseSort = sort => {
  return (sort || '').split(':');
};

export const getIndexParamsByFilters = ({
  organisaatioOid,
  nimi,
  page,
  orderBy,
  tila,
}) => {
  const [orderField, orderDirection] = parseSort(orderBy);

  return {
    organisaatioOid,
    nimi,
    page: _.isNumber(page) ? page + 1 : 1,
    pageSize: 10,
    orderField,
    orderDirection,
    tila: tila ? tila.value : null,
  };
};

export const createCanReadSomethingRoleBuilder = (rb, organisaatio) => {
  return rb.hasReadOneOf(
    [
      KOULUTUS_ROLE,
      TOTEUTUS_ROLE,
      HAKU_ROLE,
      VALINTAPERUSTE_ROLE,
      HAKUKOHDE_ROLE,
    ],
    organisaatio
  );
};

export const isEditable = (roleBuilder, organisaatio) =>
  roleBuilder.hasCreate(OPPILAITOS_ROLE, organisaatio).result();

export const getEditLinkURL = organisaatio => {
  if (organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS, organisaatio)) {
    return `/organisaatio/${organisaatio.oid}/oppilaitos`;
  } else if (
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE, organisaatio)
  ) {
    return `/organisaatio/${organisaatio.oid}/oppilaitoksen-osa`;
  }
};
