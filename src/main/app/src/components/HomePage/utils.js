import { isNumber } from '../../utils';

import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  VALINTAPERUSTE_ROLE,
  HAKUKOHDE_ROLE,
} from '../../constants';

export const makeOnSort = ({ name, onSort }) => dir => onSort(`${name}:${dir}`);

export const getSortDirection = ({ sort, name }) => {
  if (!sort) {
    return null;
  }

  const [sortName, dir] = sort.split(':');

  if (!dir) {
    return null;
  }

  return sortName === name ? dir : null;
};

export const parseSort = sort => {
  return (sort || '').split(':');
};

export const getIndexParamsByFilters = ({
  organisaatioOid,
  nimi,
  page,
  orderBy,
  tila,
  showArchived,
}) => {
  const [orderField, orderDirection] = parseSort(orderBy);

  return {
    organisaatioOid,
    nimi,
    page: isNumber(page) ? page + 1 : 1,
    pageSize: 10,
    orderField,
    orderDirection,
    showArchived,
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
    organisaatio,
  );
};
