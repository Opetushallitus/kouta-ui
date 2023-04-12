import {
  flatFilterHierarkia,
  flattenHierarkia,
  filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch,
} from './hierarkiaHelpers';

const childWithChildren = {
  oid: '4',
  children: [{ oid: '5' }, { oid: '6' }],
} as Organisaatio;

const hierarchy = [
  {
    oid: '1',
    children: [{ oid: '2' }, { oid: '3' }, childWithChildren],
  },
] as Array<Organisaatio>;

test('flattens organization hierarchy', () => {
  const expected = [
    hierarchy[0],
    { oid: '2' },
    { oid: '3' },
    childWithChildren,
    { oid: '5' },
    { oid: '6' },
  ];
  expect(flattenHierarkia(hierarchy)).toEqual(expected);
});

test('flattens organization hierarchy with filter', () => {
  const filterFn = obj => Number.parseInt(obj.oid) % 2 === 0;
  const expected = [{ oid: '2' }, childWithChildren, { oid: '6' }];
  expect(flatFilterHierarkia(hierarchy, filterFn)).toEqual(expected);
});

describe('filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch', () => {
  test('does nothing when parent passes the filter', () => {
    const filterFn = obj => '4' === obj.oid;
    expect(
      filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch(
        [childWithChildren],
        filterFn
      )
    ).toEqual([childWithChildren]);
  });

  test('utilizes chilren when parent does not pass the filter', () => {
    const filterFn = obj => '4' !== obj.oid;
    expect(
      filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch(
        [childWithChildren],
        filterFn
      )
    ).toEqual(childWithChildren.children);
  });
});
