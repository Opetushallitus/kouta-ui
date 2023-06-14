import { isApurahaVisible } from './toteutusVisibilities';

test.each([
  ['maksuton', false],
  ['maksullinen', false],
  ['lukuvuosimaksu', true],
])('isApurahaVisible', (maksullisuustyyppi, expected) =>
  expect(isApurahaVisible(maksullisuustyyppi)).toEqual(expected)
);
