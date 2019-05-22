import { isArray, isObject } from './index';

const isEmpty = value => {
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  if (isArray(value)) {
    return value.length === 0;
  }

  return true;
};

export default isEmpty;
