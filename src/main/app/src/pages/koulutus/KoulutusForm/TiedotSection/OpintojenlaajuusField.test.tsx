import { isValidOpintojenlaajuus } from './OpintojenlaajuusField';

test('should accept an opintojenlaajuus that starts with a number', () => {
  const opintojenlaajuus = '180120';
  expect(isValidOpintojenlaajuus(opintojenlaajuus)).toBe(true);
});

test('should not accept an opintojenlaajuus that starts with a letter', () => {
  const opintojenlaajuus = 'eb';
  expect(isValidOpintojenlaajuus(opintojenlaajuus)).toBe(false);
});

test('should accept an opintojenlaajuus koodiarvo that starts with the letter v and is followed by a number', () => {
  const opintojenlaajuus = 'v53';
  expect(isValidOpintojenlaajuus(opintojenlaajuus)).toBe(true);
});

test('should not accept an opintojenlaajuus koodiarvo that starts with the letter v and is not followed by a number', () => {
  const opintojenlaajuus = 'virhe';
  expect(isValidOpintojenlaajuus(opintojenlaajuus)).toBe(false);
});
