import { differenceInMonths } from 'date-fns';
import _ from 'lodash';
import _fp from 'lodash/fp';

import {
  formValueExists as exists,
  getFieldNameWithoutLanguage,
  isPartialDate,
} from '#/src/utils';
import { getInvalidTranslations } from '#/src/utils/languageUtils';

// TODO: Remove ErrorBuilder and replace all form validations with just _fp.flow(...validators)({values})
class ErrorBuilder {
  constructor(
    values,
    languages: Array<LanguageCode> = [],
    registeredFields: Record<string, { name: string }> | null = null
  ) {
    this.languages = languages;
    this._values = values;
    this.errors = {};
    this.registeredFields =
      registeredFields &&
      _.values(registeredFields).map(v => getFieldNameWithoutLanguage(v.name)!);
  }

  private languages: Array<LanguageCode>;
  private _values: Record<string, any>;
  private errors: Record<string, any>;
  private registeredFields: Array<string> | null;

  getValue(path) {
    return _.get(this._values, path);
  }

  getValues() {
    return this._values;
  }

  get values() {
    return this._values;
  }

  isVisible(path: string) {
    return (
      _.isNil(this.registeredFields) || this.registeredFields.includes(path)
    );
  }

  getErrors() {
    return this.errors;
  }

  setError(path, value) {
    _.set(this.errors, path, value ? _.castArray(value) : null);
  }

  validateExistenceOfDate(path, { message = null } = {}) {
    if (!this.isVisible(path)) {
      return this;
    }

    const errorMessage = message || 'validointivirheet.pakollinen';
    const value = this.getValue(path);
    if (!exists(value) || isPartialDate(value)) {
      this.setError(path, errorMessage);
    }

    return this;
  }

  validateExistence(path, { message = null } = {}) {
    if (!this.isVisible(path)) {
      return this;
    }

    const errorMessage = message || 'validointivirheet.pakollinen';
    if (!exists(this.getValue(path))) {
      this.setError(path, errorMessage);
    }

    return this;
  }

  validateUrl(path, { message = null } = {}) {
    if (!this.isVisible(path)) {
      return this;
    }

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
    _.forEach(Object.entries(value || {}), ([lang, value]) => {
      if (!validURL(value)) {
        this.setError(`${path}.${lang}`, errorMessage);
      }
    });

    return this;
  }

  validate(path, validator, { message = null } = {}) {
    if (!this.isVisible(path)) {
      return this;
    }

    const errorMessage = message || 'validointivirheet.pakollinen';

    if (!validator(this.getValue(path))) {
      this.setError(path, errorMessage);
    }

    return this;
  }

  validateTranslations(
    path,
    languages,
    { optional = false, message = null, validator = v => exists(v) } = {}
  ) {
    if (!this.isVisible(path)) {
      return this;
    }

    const errorMessage =
      message ||
      (optional
        ? 'validointivirheet.kaikkiKaannoksetJosAinakinYksi'
        : 'validointivirheet.pakollisetKaannokset');

    const usedLanguages = languages || this.languages;
    const invalidTranslations = getInvalidTranslations(
      this.getValue(path),
      usedLanguages,
      validator,
      optional
    );

    if (invalidTranslations.length > 0) {
      usedLanguages.forEach(l => this.setError(`${path}.${l}`, errorMessage));
    }

    return this;
  }

  //Jos oppilaitoksen osan hakijapalveluille on annettu yhteystietoja, on nimi pakollinen ainakin yhdellä kielellä.
  validateHakijapalveluidenYhteystiedot(
    path,
    { message = null, languages = [] } = {}
  ) {
    if (!this.isVisible(path)) {
      return this;
    }

    const hpy = this.getValue(path);
    const pickTranslations = _fp.pick(languages || []);
    const hasNonemptyKieliversio = v =>
      v &&
      Object.values(pickTranslations(v)).some(n => String(n).trim().length > 0);

    const validateYhteystiedot = (Object.values(hpy) || []).some(v =>
      hasNonemptyKieliversio(v)
    );

    if (
      validateYhteystiedot &&
      !Object.values(pickTranslations(hpy.nimi)).some(
        n => String(n).trim().length > 0
      )
    ) {
      languages.forEach(l => this.setError(`${path}.nimi.${l}`, message));
    }

    return this;
  }

  validateArrayMinLength(
    path,
    min,
    { message = null, isFieldArray = false } = {}
  ) {
    if (!this.isVisible(path)) {
      return this;
    }

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

  validateArray(path, makeBuilder) {
    if (!this.isVisible(path)) {
      return this;
    }

    const value = this.getValue(path);

    if (_.isArray(value)) {
      const errors = value.map(v => {
        // NOTE: ehdollinen näkyvyys *EI* toimi nestatuissa validaattoreissa (e.g. validateArrayn sisäiset validaattorit)
        // Jos tätä tarvitsee joskus tukea, täytyy errorbuilderille lisätä basepath tjms. mikä kertoo jos se on sisäinen eb
        return makeBuilder(new ErrorBuilder(v, this.languages), v).getErrors();
      });

      if (errors.find(e => !_.isEmpty(e))) {
        this.setError(path, errors);
      }
    }

    return this;
  }

  validateInteger(path, { min, max, optional }, message = null) {
    if (!this.isVisible(path)) {
      return this;
    }

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

  validateArchiveDate(path, months) {
    const viimeisinHakuaikaPaattyyPvm = this.getValue(path + '.hakuaika')
      .map(h => new Date(h.paattyy))
      .sort((a, b) => b - a)[0];
    const arkistointipvm = new Date(
      this.getValue(path + '.ajastettuHaunJaHakukohteidenArkistointi')
    );

    if (
      differenceInMonths(arkistointipvm, viimeisinHakuaikaPaattyyPvm) < months
    ) {
      this.setError(path + '.ajastettuHaunJaHakukohteidenArkistointi', t =>
        t('validointivirheet.arkistointiAikavaliLiianLyhyt', { months: months })
      );
    }

    return this;
  }
}

const bindValidator =
  name =>
  (...props) =>
  eb =>
    ErrorBuilder.prototype[name].call(eb, ...props);

// TODO: Refactor these as simple pure functional validators that always return a new {values, errors, languages} -object
export const validate = bindValidator('validate');
export const validateArray = bindValidator('validateArray');
export const validateArrayMinLength = bindValidator('validateArrayMinLength');
export const validateExistence = bindValidator('validateExistence');
export const validateExistenceOfDate = bindValidator('validateExistenceOfDate');
export const validateTranslations = bindValidator('validateTranslations');
export const validateUrl = bindValidator('validateUrl');
export const validateInteger = bindValidator('validateInteger');
export const validateArchiveDate = bindValidator('validateArchiveDate');
export const validateHakijapalveluidenYhteystiedot = bindValidator(
  'validateHakijapalveluidenYhteystiedot'
);

export const createErrorBuilder = (
  values,
  languages = [],
  registeredFields = null
) => new ErrorBuilder(values, languages, registeredFields);

export default createErrorBuilder;
