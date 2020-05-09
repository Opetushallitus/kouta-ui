import { isArray, isEmpty, isFunction } from 'lodash';

const filterTree = (tree, filterFn, options = {}) => {
  if (!isFunction(filterFn)) {
    return tree;
  }

  const { childrenKey = 'children', filterChildren = false } = options;

  if (isEmpty(tree) || !isArray(tree)) {
    return [];
  }

  return tree
    .map(branch => ({
      ...branch,
      [childrenKey]: filterTree(branch[childrenKey], filterFn, options),
    }))
    .filter(item =>
      filterChildren || isEmpty(item[childrenKey]) ? filterFn(item) : true
    );
};

export default filterTree;
