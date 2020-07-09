import _ from 'lodash';

export const getLanguageValue = (value, language = 'fi') =>
  _.isObject(value) ? value[language] || null : null;

export const getFirstLanguageValue = (value, priorityArg) => {
  const defaultPriority = ['fi', 'en', 'sv'];

  let priority = defaultPriority;

  if (_.isArray(priorityArg)) {
    priority = [...priorityArg, ...defaultPriority];
  }

  if (_.isString(priorityArg)) {
    priority = [priorityArg, ...defaultPriority];
  }

  // eslint-disable-next-line
  for (const p of priority) {
    const v = getLanguageValue(value, p);

    if (v) {
      return v;
    }
  }

  return null;
};

export const arrayToTranslationObject = (arr, languageField = 'kieli') => {
  return _.isArray(arr)
    ? arr.reduce((acc, curr) => {
        acc[
          _.isString(curr[languageField])
            ? curr[languageField].toLowerCase()
            : '_'
        ] = curr;

        return acc;
      }, {})
    : {};
};

export const getInvalidTranslations = (
  obj,
  languages = [],
  validate = v => !!v,
  optional
) => {
  if (optional && _.isEmpty(obj)) {
    return [];
  }

  if (!_.isObject(obj)) {
    return languages;
  }

  const translationObj = {
    ..._.zipObject(languages),
    ..._.pick(obj, languages),
  };

  const pairs = _.toPairs(translationObj);

  return pairs
    .filter(([, value]) => !validate(value))
    .map(([language]) => language);
};
