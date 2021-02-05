import _ from 'lodash';

import { formValueExists as exists, isPartialDate } from '#/src/utils';
import { getInvalidTranslations } from '#/src/utils/languageUtils';

class ErrorBuilder {
  constructor(values, errors = {}) {
    this.errors = errors;
    this.values = values;
  }

  getValue(path) {
    return _.get(this.values, path);
  }

  setError(path, value) {
    _.set(this.errors, path, value ? _.castArray(value) : null);
  }

  validateExistenceOfDate(path, { message } = {}) {
    const errorMessage = message || 'validointivirheet.pakollinen';
    const value = this.getValue(path);
    if (!exists(value) || isPartialDate(value)) {
      this.setError(path, errorMessage);
    }

    return this;
  }

  validateExistence(path, { message } = {}) {
    const errorMessage = message || 'validointivirheet.pakollinen';

    if (!exists(this.getValue(path))) {
      this.setError(path, errorMessage);
    }

    return this;
  }

  validateUrl(path, { message } = {}) {
    const errorMessage = message || 'validointivirheet.epakelpoUrl';
    const value = this.getValue(path);
    const validURL = str => {
      try {
        const url = new URL(str);
        return _.includes(['http:', 'https:'], url.protocol);
      } catch (_) {
        return false;
      }
    };
    _.each(Object.entries(value || {}), ([lang, value]) => {
      if (!validURL(value)) {
        this.setError(`${path}.${lang}`, errorMessage);
      }
    });

    return this;
  }

  validate(path, validator, { message } = {}) {
    const errorMessage = message || 'validointivirheet.pakollinen';

    if (!validator(this.getValue(path))) {
      this.setError(path, errorMessage);
    }

    return this;
  }

  validateArrayMinLength(path, min, { message, isFieldArray = false } = {}) {
    const value = this.getValue(path);
    const errorMessage = message
      ? message
      : min === 1
      ? 'validointivirheet.listaVahintaanYksi'
      : t => t('validointivirheet.listaVahintaan', { lukumaara: 1 });

    if (!_.isArray(value) || value.length < min) {
      this.setError(isFieldArray ? `${path}._error` : path, errorMessage);
    }

    return this;
  }

  validateTranslations(
    path,
    languages,
    { optional, message, validator = v => exists(v) } = {}
  ) {
    const errorMessage =
      message || optional
        ? 'validointivirheet.kaikkiKaannoksetJosAinakinYksi'
        : 'validointivirheet.pakollisetKaannokset';

    const invalidTranslations = getInvalidTranslations(
      this.getValue(path),
      languages,
      validator,
      optional
    );

    if (invalidTranslations.length > 0) {
      languages.forEach(l => this.setError(`${path}.${l}`, errorMessage));
    }

    return this;
  }

  validateArray(path, makeBuilder) {
    const value = this.getValue(path);

    if (_.isArray(value)) {
      const errors = value.map(v => {
        return makeBuilder(new ErrorBuilder(v), v).getErrors();
      });

      if (errors.find(e => !_.isEmpty(e))) {
        this.setError(path, errors);
      }
    }

    return this;
  }

  validateInteger(path, { min, max, optional }, message = undefined) {
    const errorMessage = message || 'validointivirheet.kokonaislukuValilta';
    const value = this.getValue(path);

    if (_.isNil(value) || value === '') {
      if (optional) {
        return this;
      } else {
        this.setError(path, t => t(errorMessage, { min, max }));
        return this;
      }
    }

    const numberValue = Number(value);
    if (
      !Number.isInteger(numberValue) ||
      numberValue < min ||
      numberValue > max
    ) {
      this.setError(path, t => t(errorMessage, { min, max }));
    }

    return this;
  }

  getErrors() {
    return this.errors;
  }
}

const bindValidator = name => (...props) => eb =>
  ErrorBuilder.prototype[name].call(eb, ...props);

export const validate = bindValidator('validate');
export const validateArray = bindValidator('validateArray');
export const validateArrayMinLength = bindValidator('validateArrayMinLength');
export const validateExistence = bindValidator('validateExistence');
export const validateExistenceOfDate = bindValidator('validateExistenceOfDate');
export const validateTranslations = bindValidator('validateTranslations');
export const validateUrl = bindValidator('validateUrl');
export const validateInteger = bindValidator('validateInteger');

const createErrorBuilder = values => new ErrorBuilder(values);

export default createErrorBuilder;
