import _ from 'lodash';

export enum Order {
  TopDown = 'top-down',
  BottomUp = 'bottom-up',
}

type TreeNode = Record<string, any>;

type Options = {
  childrenKey?: string;
  order?: Order;
};

const iterateTree = (
  tree: Array<TreeNode>,
  fn: (node: TreeNode) => void,
  options: Options = {}
) => {
  const { childrenKey = 'children', order = Order.TopDown } = options;

  if (_.isArray(tree)) {
    tree.forEach(child => {
      if (order === Order.TopDown) {
        fn(child);
      }
      iterateTree(child[childrenKey], fn, options);
      if (order === Order.BottomUp) {
        fn(child);
      }
    });
  }
};

export default iterateTree;
