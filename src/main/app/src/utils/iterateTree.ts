import _ from 'lodash';

const iterateTree = (tree, fn, options = {}) => {
  const { childrenKey = 'children' } = options;

  if (_.isArray(tree)) {
    tree.forEach(child => {
      fn(child);
      iterateTree(child[childrenKey], fn, options);
    });
  }
};

export default iterateTree;
