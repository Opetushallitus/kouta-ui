import { isEmpty, isFunction } from 'lodash';

function filterTree<Item extends { children?: Array<Item> }>(
  tree: Array<Item> | undefined,
  filterFn?: (item: Item) => boolean
): Array<Item> | undefined {
  if (!isFunction(filterFn)) {
    return tree;
  }

  if (isEmpty(tree) || !Array.isArray(tree)) {
    return [];
  }

  return tree
    .map(branch => ({
      ...branch,
      children: filterTree(branch.children, filterFn),
    }))
    .filter(item => (isEmpty(item.children) ? filterFn(item) : true));
}

export default filterTree;
