import { isArray } from './index';

const iterateTree = (tree, fn, options = {}) => {
  const { childrenKey = 'children' } = options;

  if (isArray(tree)) {
    tree.forEach(child => {
      fn(child);
      iterateTree(child[childrenKey], fn, options);
    });
  }
};

export default iterateTree;
