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

const isObject = (item) => ({}.constructor === item.constructor);

export const enforceObject = (item) => isObject(item) ? item : {_value: item};

export const getValueOrClone = (item) => safeClone(item['_value'] || item);

