import filterTree from '../filterTree';

const SIMPLE_TEST_TREE = [
  {
    id: '12345',
    children: [
      {
        id: '456',
        children: [],
      },
      {
        id: '999',
        children: [],
      },
    ],
  },
];

test('Should return original tree without filter', () => {
  const filtered = filterTree(SIMPLE_TEST_TREE);
  expect(filtered).toEqual(SIMPLE_TEST_TREE);
});

test('Should work with empty tree', () => {
  const filtered = filterTree([], () => true);
  expect(filtered).toEqual([]);
});

test('Should filter everything', () => {
  const filtered = filterTree(SIMPLE_TEST_TREE, () => false);
  expect(filtered).toEqual([]);
});

test('Should filter all leaves when selecting parent', () => {
  const filtered = filterTree(SIMPLE_TEST_TREE, ({ id }) => id === '12345');
  expect(filtered).toEqual([
    {
      id: '12345',
      children: [],
    },
  ]);
});

test('Should preserve a branch when filtering a leaf', () => {
  const filtered = filterTree(SIMPLE_TEST_TREE, ({ id }) => id === '456');
  expect(filtered).toEqual([
    {
      id: '12345',
      children: [
        {
          id: '456',
          children: [],
        },
      ],
    },
  ]);
});
