import _isDate from 'date-fns/is_date';
import diff from 'fast-array-diff';

export const isString = value => typeof value === 'string';

export const isNumber = value => typeof value === 'number';

export const isDate = value => _isDate(value);

export const isObject = value => toString.call(value) === '[object Object]';

export const isArray = value => toString.call(value) === '[object Array]';

export const getLanguageValue = (value, language = 'fi') =>
  isObject(value) ? value[language] || value['fi'] || null : null;

export const isFunction = value => typeof value === 'function';

export const getTreeLevel = ({
  tree,
  level,
  childrenKey = 'children',
  currentLevel = 0,
}) => {
  if (!isObject(tree) || !isArray(tree[childrenKey])) {
    return [];
  }

  if (currentLevel === level) {
    return tree[childrenKey];
  }

  return tree[childrenKey].reduce((acc, curr) => {
    return [
      ...acc,
      ...getTreeLevel({ tree: curr, level, currentLevel: currentLevel + 1 }),
    ];
  }, []);
};

export const arrayDiff = (previous, next) => {
  return diff.diff(previous, next);
};

export const getFirstLanguageValue = (value, priority = ['fi', 'en', 'sv']) => {
  for (const p of priority) {
    const v = getLanguageValue(value, p);

    if (v) {
      return v;
    }
  }

  return null;
};

export const truncateString = (value, length) => {
  if (!isString(value)) {
    return '';
  }

  const slice = value.slice(0, length);

  return slice.length < length ? `${slice}...` : slice;
};
