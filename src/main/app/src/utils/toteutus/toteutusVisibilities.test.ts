import { KOULUTUSTYYPPI } from '#/src/constants';

import { isApurahaVisible } from './toteutusVisibilities';

describe('isApurahaVisible', () => {
  test('should return false when maksullisuustyyppi is maksuton', () => {
    expect(
      isApurahaVisible('maksuton', KOULUTUSTYYPPI.YLIOPISTOKOULUTUS)
    ).toBeFalsy();
  });

  test('should return false when maksullisuustyyppi is maksullinen', () => {
    expect(
      isApurahaVisible('maksullinen', KOULUTUSTYYPPI.YLIOPISTOKOULUTUS)
    ).toBeFalsy();
  });

  test('should return true when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is yo', () => {
    expect(
      isApurahaVisible('lukuvuosimaksu', KOULUTUSTYYPPI.YLIOPISTOKOULUTUS)
    ).toBeTruthy();
  });

  test('should return true when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is amk', () => {
    expect(
      isApurahaVisible('lukuvuosimaksu', KOULUTUSTYYPPI.AMKKOULUTUS)
    ).toBeTruthy();
  });

  test('should return false when maksullisuustyyppi is lukuvuosimaksu and koulutustyyppi is amm', () => {
    expect(
      isApurahaVisible('lukuvuosimaksu', KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS)
    ).toBeFalsy();
  });

  test('should return false when maksullisuustyyppi is lukuvuosimaksu_amm_lk and koulutustyyppi is amm', () => {
    expect(
      isApurahaVisible(
        'lukuvuosimaksu_amm_lk',
        KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
      )
    ).toBeFalsy();
  });
});
