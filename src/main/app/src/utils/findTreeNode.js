import { isArray } from './index';

const findTreeNode = (tree, findFn, options = {}) => {
  const { childrenKey = 'children' } = options;
  const treeArr = isArray(tree) ? tree : [];

  // eslint-disable-next-line
  for (const node of treeArr) {
    if (findFn(node)) {
      return node;
    }

    const foundNode = findTreeNode(node[childrenKey], findFn, options);

    if (foundNode) {
      return foundNode;
    }
  }

  return undefined;
};

export default findTreeNode;
