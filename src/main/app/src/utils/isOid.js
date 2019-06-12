import { isString } from './index';

const isOid = value => {
  return isString(value) && /^[0-9]+(\.[0-9]+)+$/.test(value);
};

export default isOid;
