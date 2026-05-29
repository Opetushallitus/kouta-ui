import _ from 'lodash';

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

type ValueObject = {
  value?: unknown;
};

const selectValueToSimpleValue = (
  v: Array<ValueObject> | ValueObject | null | undefined
) => {
  switch (true) {
    case _.isArray(v):
      return v.map($ => $?.value);
    case _.isObject(v):
      return v?.value;
    default:
      return null;
  }
};

const nakyvyysToBoolean = (v: ValueObject | null | undefined) => {
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

export type FiltersState = {
  organisaatioOid?: string;
  nimi?: string;
  hakuNimi?: string;
  page?: number;
  orderBy?: string;
  tila?: any;
  koulutustyyppi?: any;
  hakutapa?: any;
  nakyvyys?: any;
  koulutuksenAlkamiskausi?: any;
  koulutuksenAlkamisvuosi?: any;
  orgWhitelist?: any;
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
}: FiltersState) => {
  const [orderField, orderDirection] = parseSort(orderBy);
  return {
    organisaatioOid,
    nimi,
    hakuNimi,
    page: _.isNumber(page) ? page + 1 : 1,
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
