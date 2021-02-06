import _ from 'lodash';

const filterTree = (tree, filterFn, options = {}) => {
  if (!_.isFunction(filterFn)) {
    return tree;
  }

  const { childrenKey = 'children', filterChildren = false } = options;

  if (_.isEmpty(tree) || !_.isArray(tree)) {
    return [];
  }

  return tree
    .map(branch => ({
      ...branch,
      [childrenKey]: filterTree(branch[childrenKey], filterFn, options),
    }))
    .filter(item =>
      filterChildren || _.isEmpty(item[childrenKey]) ? filterFn(item) : true
    );
};

export default filterTree;
