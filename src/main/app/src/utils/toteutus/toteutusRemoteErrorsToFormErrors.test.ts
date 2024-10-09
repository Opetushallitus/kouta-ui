import {
  findIndices,
  findAllIndices,
} from './toteutusRemoteErrorsToFormErrors';

describe('findAllIndices', () => {
  test('should return an empty array when virheellinen is undefined', () => {
    const liitetytOsaamismerkit = ['1.2.246.562.13.00000000000000009094'];
    expect(findAllIndices(liitetytOsaamismerkit, undefined)).toEqual([]);
  });

  test('should return an empty array when no liitetty osaamismerkki', () => {
    const liitetytOsaamismerkit = [];
    expect(
      findAllIndices(
        liitetytOsaamismerkit,
        '1.2.246.562.13.00000000000000009092'
      )
    ).toEqual([]);
  });

  test('should return 0 index for one and only matching oid', () => {
    const liitetytOsaamismerkit = ['1.2.246.562.13.00000000000000009092'];
    expect(
      findAllIndices(
        liitetytOsaamismerkit,
        '1.2.246.562.13.00000000000000009092'
      )
    ).toEqual([0]);
  });

  test('should return 0 and 2 indices for one matching oid', () => {
    const liitetytOsaamismerkit = [
      '1.2.246.562.13.00000000000000009092',
      '1.2.246.562.13.00000000000000009093',
      '1.2.246.562.13.00000000000000009092',
    ];
    expect(
      findAllIndices(
        liitetytOsaamismerkit,
        '1.2.246.562.13.00000000000000009092'
      )
    ).toEqual([0, 2]);
  });
});

describe('findIndices', () => {
  test('should return an empty array when no matching oids', () => {
    const liitetytOsaamismerkit = ['1.2.246.562.13.00000000000000009094'];
    expect(findIndices(liitetytOsaamismerkit, [])).toEqual([]);
  });

  test('should return an array with one matching oid', () => {
    const liitetytOsaamismerkit = ['1.2.246.562.13.00000000000000009094'];
    const virheellisetOsaamismerkit = ['1.2.246.562.13.00000000000000009094'];
    expect(
      findIndices(liitetytOsaamismerkit, virheellisetOsaamismerkit)
    ).toEqual([0]);
  });

  test('should return an array with several matching oids including duplicates', () => {
    const liitetytOsaamismerkit = [
      '1.2.246.562.13.00000000000000009091',
      '1.2.246.562.13.00000000000000009094',
      '1.2.246.562.13.00000000000000009092',
    ];
    const virheellisetOsaamismerkit = [
      '1.2.246.562.13.00000000000000009094',
      '1.2.246.562.13.00000000000000009094',
      '1.2.246.562.13.00000000000000009092',
    ];
    expect(
      findIndices(liitetytOsaamismerkit, virheellisetOsaamismerkit)
    ).toEqual([1, 2]);
  });
});
