import { isValidKoulutusKoodi } from './isValidKoulutusKoodi';

const validKoodiarvo = '123456';
const valiotsikkoKoodiarvo = '123400';

const validKoodisto = { koodistoUri: 'koulutus' };
const invalidKoodisto = { koodistoUri: 'ei_koulutus' };

const noLoppuPvm = undefined;
const validLoppuPvm = '2030-01-01';
const invalidLoppuPvm = '2000-01-01';

describe('validateInteger', () => {
  test('Should return true when all criteria valid', () => {
    expect(
      isValidKoulutusKoodi({
        koodiArvo: validKoodiarvo,
        koodisto: validKoodisto,
        voimassaLoppuPvm: validLoppuPvm,
      })
    ).toBeTruthy();
  });

  test('Undefined loppuPvm is valid', () => {
    expect(
      isValidKoulutusKoodi({
        koodiArvo: validKoodiarvo,
        koodisto: validKoodisto,
        voimassaLoppuPvm: noLoppuPvm,
      })
    ).toBeTruthy();
  });

  test('Should return false when koodiarvo represents a väliotsikko', () => {
    expect(
      isValidKoulutusKoodi({
        koodiArvo: valiotsikkoKoodiarvo,
        koodisto: validKoodisto,
        voimassaLoppuPvm: validLoppuPvm,
      })
    ).toBeFalsy();
  });

  test('Should return false when koodisto is not koulutus', () => {
    expect(
      isValidKoulutusKoodi({
        koodiArvo: validKoodiarvo,
        koodisto: invalidKoodisto,
        voimassaLoppuPvm: validLoppuPvm,
      })
    ).toBeFalsy();
  });

  test('Should return false when voimassaLoppuPvm is past', () => {
    expect(
      isValidKoulutusKoodi({
        koodiArvo: validKoodiarvo,
        koodisto: invalidKoodisto,
        voimassaLoppuPvm: invalidLoppuPvm,
      })
    ).toBeFalsy();
  });
});
