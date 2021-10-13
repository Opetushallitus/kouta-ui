import isHakukohteenTakarajaExpired from '#/src/utils/haku/isHakukohteenTakarajaExpired';

test('should return false for takaraja that is tomorrow', () => {
  const now = new Date('2019-02-07T10:00');
  const takaraja = new Date('2019-02-08T07:05');

  expect(isHakukohteenTakarajaExpired(now, takaraja)).toBe(false);
});

test('should return true for takaraja that was yesterday', () => {
  const now = new Date('2019-02-09T10:00');
  const takaraja = new Date('2019-02-08T07:05');

  expect(isHakukohteenTakarajaExpired(now, takaraja)).toBe(true);
});
