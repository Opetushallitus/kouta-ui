import _ from 'lodash';

const sortTreeBy = (tree = [], sortOpt) => {
  return _.sortBy(
    tree.map(item => ({
      ...item,
      children: sortTreeBy(item.children, sortOpt),
    })),
    sortOpt
  );
};
export default sortTreeBy;
