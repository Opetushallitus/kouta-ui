import createErrorBuilder, { validateInteger } from './createErrorBuilder';

let eb;

const setTestValue = value => {
  eb = createErrorBuilder({
    test: value,
  });
};

const expectError = shouldError =>
  shouldError
    ? expect(eb.getErrors()?.test).toBeDefined()
    : expect(eb.getErrors()?.test).toBeUndefined();

describe('validateInteger', () => {
  test('Should not accept null when optional flag set', () => {
    setTestValue(null);

    validateInteger('test', { min: 1, max: 100 })(eb);
    expectError(true);
  });

  test('Should accept null when optional flag set', () => {
    setTestValue(null);

    validateInteger('test', { min: 1, max: 100, optional: true })(eb);
    expectError(false);
  });

  test('Should not accept empty string when not optional', () => {
    setTestValue('');

    validateInteger('test', { min: 1, max: 100 })(eb);
    expectError(true);
  });

  test('Should not accept invalid characters at the end of the input', () => {
    setTestValue('1234asdf');

    validateInteger('test', { min: 0, max: 100 })(eb);
    expectError(true);
  });

  test('Should work without max', () => {
    setTestValue(999);

    validateInteger('test', {
      min: 0,
    })(eb);
    expectError(false);
  });

  test('Should work with negative numbers', () => {
    setTestValue(-2);

    validateInteger('test', {
      min: 0,
    })(eb);
    expectError(true);
  });

  test('Should allow number as string', () => {
    setTestValue('99');

    validateInteger('test', {
      min: 0,
      max: 100,
    })(eb);
    expectError(false);
  });

  test('Should accept value at min', () => {
    setTestValue(0);

    validateInteger('test', {
      min: 0,
      max: 100,
    })(eb);
    expectError(false);
  });

  test('Should accept value at max', () => {
    setTestValue(100);

    validateInteger('test', {
      min: 0,
      max: 100,
    })(eb);
    expectError(false);
  });

  test('Should reject value below range', () => {
    setTestValue(1);

    validateInteger('test', {
      min: 10,
      max: 100,
    })(eb);
    expectError(true);
  });

  test('Should reject value above range', () => {
    setTestValue(101);

    validateInteger('test', {
      min: 10,
      max: 100,
    })(eb);
    expectError(true);
  });
});
