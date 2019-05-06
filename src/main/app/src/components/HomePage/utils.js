import { isNumber, isArray } from '../../utils';

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
    organisaatioOid: [organisaatioOid],
    nimi,
    page: isNumber(page) ? page + 1 : 1,
    pageSize: 10,
    orderField,
    orderDirection,
    showArchived,
    tila: tila ? tila.value : null,
  };
};

export const getFilteredHierarkia = (hierarkia, filter) => {
  return hierarkia.filter(filter).map(({ children, ...rest }) => {
    return {
      ...rest,
      children: isArray(children) ? getFilteredHierarkia(children, filter) : [],
    };
  });
};
