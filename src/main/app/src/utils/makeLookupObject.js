import { isArray, isString } from './index';

const makeLookupObject = arr => {
  if (!isArray(arr)) {
    return {};
  }

  const lookup = {};

  for (let value of arr) {
    if (isString(value)) {
      lookup[value] = true;
    }
  }

  return lookup;
};

export default makeLookupObject;
