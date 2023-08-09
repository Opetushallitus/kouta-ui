import _ from 'lodash';
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
import { organisaatioMatchesTyyppi } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const parseSort = sort => {
  return (sort || '').split(':');
};

const selectValueToSimpleValue = v => {
  switch (true) {
    case _.isArray(v):
      return v.map(_fp.prop('value'));
    case _.isObject(v):
      return v?.value;
    default:
      return null;
  }
};

const nakyvyysToBoolean = v => {
  if (v) {
    if (v.value === NAKYVYYS.JULKINEN) {
      return true;
    } else if (v.value === NAKYVYYS.EI_JULKINEN) {
      return false;
    } else {
      return null;
    }
  }
};

export const getIndexParamsByFilters = ({
  organisaatioOid,
  nimi,
  hakuNimi,
  page,
  orderBy,
  tila,
  koulutustyyppi,
  hakutapa,
  nakyvyys,
  koulutuksenAlkamiskausi,
  koulutuksenAlkamisvuosi,
  orgWhitelist,
}) => {
  const [orderField, orderDirection] = parseSort(orderBy);
  return {
    organisaatioOid,
    nimi,
    hakuNimi,
    page: _fp.isNumber(page) ? page + 1 : 1,
    pageSize: 10,
    orderField,
    orderDirection,
    tila: selectValueToSimpleValue(tila),
    koulutustyyppi: selectValueToSimpleValue(koulutustyyppi),
    hakutapa: selectValueToSimpleValue(hakutapa),
    julkinen: nakyvyysToBoolean(nakyvyys),
    koulutuksenAlkamiskausi: selectValueToSimpleValue(koulutuksenAlkamiskausi),
    koulutuksenAlkamisvuosi: selectValueToSimpleValue(koulutuksenAlkamisvuosi),
    orgWhitelist: selectValueToSimpleValue(orgWhitelist),
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
