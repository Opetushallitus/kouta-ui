import {
  canUpdateHakukohde,
  canCreateHakukohde,
  isHakukohteenTakarajaExpired,
} from '#/src/utils/hakukohde/canUpdateHakukohde';

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

test('should return true if hakukohteen muokkaamisen takaraja has not expired', () => {
  const now = new Date('2021-11-11T00:00');
  const muokkaamisenTakaraja = new Date('2021-11-12T00:00');
  expect(canUpdateHakukohde(now, muokkaamisenTakaraja)).toBe(true);
});

test('should return false if hakukohteen muokkaamisen takaraja has expired', () => {
  const now = new Date('2021-11-11T00:00');
  const muokkaamisenTakaraja = new Date('2021-11-10T00:00');
  expect(canUpdateHakukohde(now, muokkaamisenTakaraja)).toBe(false);
});

test('should return true if hakukohteen liittamisen takaraja has not expired', () => {
  const now = new Date('2021-11-11T00:00');
  const liittamisenTakaraja = new Date('2021-11-12T00:00');
  expect(canCreateHakukohde(now, liittamisenTakaraja)).toBe(true);
});

test('should return false if hakukohteen liittamisen takaraja has expired', () => {
  const now = new Date('2021-11-11T00:00');
  const liittamisenTakaraja = new Date('2021-11-10T00:00');
  expect(canCreateHakukohde(now, liittamisenTakaraja)).toBe(false);
});
