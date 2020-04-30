import {
  cond,
  every,
  get,
  isArray,
  isEmpty,
  isNil,
  isPlainObject,
  isString,
  set,
  stubTrue,
  stubFalse,
} from 'lodash';
import { getInvalidTranslations, otherwise } from './index';

const allFuncs = (...fns) => value => every(fns, fn => fn(value));
const clone = value => JSON.parse(JSON.stringify(value));

const exists = value =>
  cond([
    [isNil, stubFalse],
    [
      allFuncs(
        v => isArray(v) || isString(v),
        v => v.length === 0,
      ),
      stubFalse,
    ],
    [allFuncs(isPlainObject, isEmpty), stubFalse],
    [allFuncs(isPlainObject, v => v.value === ''), stubFalse],
    [otherwise, stubTrue],
  ])(value);

class ErrorBuilder {
  constructor(values, errors = {}) {
    this.errors = errors;
    this.values = values;
  }

  getValue(path) {
    return get(this.values, path);
  }

  setError(path, value) {
    set(this.errors, path, value);
  }

  clone() {
    return new ErrorBuilder(this.values, clone(this.errors));
  }

  validateExistence(path, { message } = {}) {
    const errorMessage = message || 'validointivirheet.pakollinen';

    if (!exists(this.getValue(path))) {
      this.setError(path, errorMessage);
    }

    return this.clone();
  }

  validate(path, validator, { message } = {}) {
    const errorMessage = message || 'validointivirheet.pakollinen';

    if (!validator(this.getValue(path))) {
      this.setError(path, errorMessage);
    }

    return this.clone();
  }

  validateArrayMinLength(path, min, { message, isFieldArray = false } = {}) {
    const value = this.getValue(path);
    const errorMessage = message
      ? message
      : min === 1
      ? 'validointivirheet.listaVahintaanYksi'
      : t => t('validointivirheet.listaVahintaan', { lukumaara: 1 });

    if (!isArray(value) || value.length < min) {
      this.setError(isFieldArray ? `${path}._error` : path, errorMessage);
    }

    return this.clone();
  }

  validateTranslations(
    path,
    languages,
    { message, validator = v => exists(v) } = {},
  ) {
    const errorMessage = message || 'validointivirheet.pakollisetKaannokset';

    const invalidTranslations = getInvalidTranslations(
      this.getValue(path),
      languages,
      validator,
    );

    if (invalidTranslations.length > 0) {
      languages.forEach(l => this.setError(`${path}.${l}`, errorMessage));
    }

    return this.clone();
  }

  validateArray(path, makeBuilder) {
    const value = this.getValue(path);

    if (isArray(value)) {
      const errors = value.map(v => {
        return makeBuilder(new ErrorBuilder(v), v).getErrors();
      });

      if (errors.find(e => !isEmpty(e))) {
        this.setError(path, errors);
      }
    }

    return this.clone();
  }

  getErrors() {
    return this.errors;
  }
}

const createErrorBuilder = values => new ErrorBuilder(values);

export default createErrorBuilder;
