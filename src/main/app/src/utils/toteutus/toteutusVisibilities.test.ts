import { KOULUTUSTYYPPI } from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

import { isApurahaVisible } from './toteutusVisibilities';

describe('isApurahaVisible', () => {
  test('should return false when maksullisuustyyppi is maksuton', () => {
    expect(
      isApurahaVisible(
        KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
        MaksullisuusTyyppi.MAKSUTON
      )
    ).toBeFalsy();
  });

  test('should return false when maksullisuustyyppi is maksullinen', () => {
    expect(
      isApurahaVisible(
        KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
        MaksullisuusTyyppi.MAKSULLINEN
      )
    ).toBeFalsy();
  });

  test('should return true when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is yo', () => {
    expect(
      isApurahaVisible(
        KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
        MaksullisuusTyyppi.LUKUVUOSIMAKSU
      )
    ).toBeTruthy();
  });

  test('should return true when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is amk', () => {
    expect(
      isApurahaVisible(
        KOULUTUSTYYPPI.AMKKOULUTUS,
        MaksullisuusTyyppi.LUKUVUOSIMAKSU
      )
    ).toBeTruthy();
  });

  test('should return false when maksullisuustyyppi is an array that contains "lukuvuosimaksu" and koulutustyyppi is amm', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS, [
        MaksullisuusTyyppi.MAKSULLINEN,
        MaksullisuusTyyppi.LUKUVUOSIMAKSU,
      ])
    ).toBeFalsy();
  });

  test('should return true when maksullisuustyyppi is an array that contains "lukuvuosimaksu" and koulutustyyppi is yo', () => {
    expect(
      isApurahaVisible(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS, [
        MaksullisuusTyyppi.LUKUVUOSIMAKSU,
      ])
    ).toBeTruthy();
  });
});
