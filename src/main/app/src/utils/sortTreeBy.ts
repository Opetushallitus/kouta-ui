import _ from 'lodash';

type Tree = Array<{
  [x: string]: unknown;
  children?: Tree;
}>;

const sortTreeBy = <T extends Tree>(tree?: T, sortOpt?: any) => {
  return (
    _.sortBy<T>(
      tree?.map(item => ({
        ...item,
        children: sortTreeBy(item?.children, sortOpt),
      })),
      sortOpt
    ) ?? []
  );
};
export default sortTreeBy;
