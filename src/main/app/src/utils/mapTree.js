import { isArray } from './index';

const mapTree = (tree, mapFn, options = {}) => {
  const { childrenKey = 'children' } = options;

  return isArray(tree)
    ? tree.map(child => {
        return {
          ...mapFn(child),
          [childrenKey]: mapTree(child[childrenKey], mapFn, options),
        };
      })
    : [];
};

export default mapTree;
