import { sortBy } from 'lodash';

const sortTreeBy = (tree = [], sortOpt) => {
  return sortBy(
    tree.map(item => ({
      ...item,
      children: sortTreeBy(item.children, sortOpt),
    })),
    sortOpt
  );
};
export default sortTreeBy;
