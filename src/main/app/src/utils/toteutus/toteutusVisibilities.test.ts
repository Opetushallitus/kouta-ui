import { KOULUTUSTYYPPI } from '#/src/constants';

import { isApurahaVisible } from './toteutusVisibilities';

describe('isApurahaVisible', () => {
  test('should return false when maksullisuustyyppi is maksuton', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS, 'maksuton')
    ).toBeFalsy();
  });

  test('should return false when maksullisuustyyppi is maksullinen', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS, 'maksullinen')
    ).toBeFalsy();
  });

  test('should return true when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is yo', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS, 'lukuvuosimaksu')
    ).toBeTruthy();
  });

  test('should return true when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is amk', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.AMKKOULUTUS, 'lukuvuosimaksu')
    ).toBeTruthy();
  });

  test('should return false when maksullisuustyyppi is an array that contains "lukuvuosimaksu" and koulutustyyppi is amm', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS, [
        'maksullinen',
        'lukuvuosimaksu',
      ])
    ).toBeFalsy();
  });

  test('should return true when maksullisuustyyppi is an array that contains "lukuvuosimaksu" and koulutustyyppi is yo', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS, ['lukuvuosimaksu'])
    ).toBeTruthy();
  });
});
