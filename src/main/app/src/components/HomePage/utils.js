import { isNumber, isArray } from '../../utils';
import get from 'lodash/get';
import memoize from 'memoizee';

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

export const getOrganisaatioHierarkiaRoot = memoize((hierarkia, oid) => {
  if (!isArray(hierarkia)) {
    return null;
  }

  const recursiveFindRoot = (node, root) => {
    if (get(node, 'oid') === oid) {
      return root;
    }

    if (isArray(get(node, 'children'))) {
      for (let n of node.children) {
        let r = recursiveFindRoot(n, root);

        if (r) {
          return r;
        }
      }
    }
  };

  for (let n of hierarkia) {
    let root = recursiveFindRoot(n, n);

    if (root) {
      return root;
    }
  }
});

export const getOrganisaatioFromHierarkia = memoize((hierarkia, oid) => {
  if (!isArray(hierarkia)) {
    return null;
  }

  const recursiveFindNode = node => {
    if (get(node, 'oid') === oid) {
      return node;
    }

    if (isArray(get(node, 'children'))) {
      for (let n of node.children) {
        let node = recursiveFindNode(n);

        if (node) {
          return node;
        }
      }
    }
  };

  for (let n of hierarkia) {
    let node = recursiveFindNode(n);

    if (node) {
      return node;
    }
  }
});
