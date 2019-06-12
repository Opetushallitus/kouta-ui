import omit from 'lodash/omit';
import { isArray } from './index';

const filterTree = (tree, filterFn, options = {}) => {
  const { childrenKey = 'children' } = options;

  return (isArray(tree) ? tree : []).filter(filterFn).map(child => {
    const rest = omit(child, [childrenKey]);

    return {
      ...rest,
      [childrenKey]: isArray(child[childrenKey])
        ? filterTree(child[childrenKey], filterFn, options)
        : [],
    };
  });
};

export default filterTree;
