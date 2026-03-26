import { isApurahaVisible } from './toteutusVisibilities';

test.each([
  ['maksuton', false],
  ['maksullinen', false],
  ['lukuvuosimaksu', true],
  ['lukuvuosimaksu_amm_lk', false],
])('isApurahaVisible', (maksullisuustyyppi, expected) =>
  expect(isApurahaVisible(maksullisuustyyppi)).toEqual(expected)
);
