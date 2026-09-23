export enum Order {
  TopDown = 'top-down',
  BottomUp = 'bottom-up',
}

type TreeNode = Record<string, any>;

type Options = {
  childrenKey?: string;
  order?: Order;
};

const iterateTree = <T extends TreeNode>(
  tree: Array<T> | undefined,
  fn: (node: T) => void,
  options: Options = {}
) => {
  const { childrenKey = 'children', order = Order.TopDown } = options;

  if (Array.isArray(tree)) {
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
