export const parseJson = (jsonString) => {
  if (!jsonString) {
    return null;
  }
  try {
    return JSON.parse(jsonString);
  } catch(e) {
    return null;
  }
}

export const clone = (item) => {
  try {
    return JSON.parse(JSON.stringify(item));
  } catch(e) {
    return item;
  }
}

export const safeClone = (item) => item ? clone(item) : null;

export const isVariableDefined = (variable) => !(typeof variable === 'undefined' || variable === null);

const isComposite = (item) => item && (typeof item  === 'object' || item instanceof Array);

export const enforceObject = (item) => item ? isComposite(item) ? item : {_value: item} : {};

export const getValueOrClone = (item) => item ? safeClone(item['_value'] || item) : null;

const deepFind = (item, regex, results) => {
  if (Array.isArray(item)) {
    item.forEach(arrayItem => deepFind(arrayItem, regex, results));
    return results;
  }
  const keys = Object.keys(item);
  keys.filter(key => regex.test(key)).forEach(matchingKey =>
    results.push(item[matchingKey])
  );
  Object.values(item).filter(isComposite).forEach(childItem => deepFind(childItem, regex, results));
  return results;
}

export const findByKey = (item, key) => deepFind(item, new RegExp(key), []);

export const filterByKeys = (item, keys) => {
  if(keys) {
      Object.keys(item).filter(k => !keys.includes(k)).forEach(k => delete item[k])
  }
  return item;
};
