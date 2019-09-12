import get from 'lodash/get';
import set from 'lodash/set';

import { isArray, getInvalidTranslations } from './index';
import isEmpty from './isEmpty';

const clone = value => JSON.parse(JSON.stringify(value));

const exists = value => {
  return value !== undefined && value !== '' && value !== null;
};

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
      : ['validointivirheet.listaVahintaan', { lukumaara: 1 }];

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
    const errorMessage = message || 'validointivirheet.pakollisetKannokset';

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
