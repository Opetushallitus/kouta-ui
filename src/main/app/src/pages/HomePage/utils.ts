import _fp from 'lodash/fp';

import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  VALINTAPERUSTE_ROLE,
  HAKUKOHDE_ROLE,
  OPPILAITOS_ROLE,
  ORGANISAATIOTYYPPI,
  NAKYVYYS,
} from '#/src/constants';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const parseSort = sort => {
  return (sort || '').split(':');
};

const selectValueToSimpleValue = v => {
  switch (true) {
    case Array.isArray(v):
      return v.map(_fp.prop('value'));
    case v:
      return v?.value;
    default:
      return null;
  }
};

const nakyvyysToSimpleValue = v => {
  if (v) {
    const vals = v.map(_fp.prop('value'));
    if (
      vals.includes(NAKYVYYS.JULKINEN) &&
      vals.includes(NAKYVYYS.EI_JULKINEN)
    ) {
      return null;
    } else if (vals.includes(NAKYVYYS.JULKINEN)) {
      return true;
    } else if (vals.includes(NAKYVYYS.EI_JULKINEN)) {
      return false;
    } else {
      return null;
    }
  }
};

export const getIndexParamsByFilters = ({
  organisaatioOid,
  nimi,
  page,
  orderBy,
  tila,
  koulutustyyppi,
  nakyvyys,
}) => {
  const [orderField, orderDirection] = parseSort(orderBy);

  return {
    organisaatioOid,
    nimi,
    page: _fp.isNumber(page) ? page + 1 : 1,
    pageSize: 10,
    orderField,
    orderDirection,
    tila: selectValueToSimpleValue(tila),
    koulutustyyppi: selectValueToSimpleValue(koulutustyyppi),
    julkinen: nakyvyysToSimpleValue(nakyvyys),
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
