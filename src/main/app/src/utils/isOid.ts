import { isString } from 'lodash';

const oidRegExp = /^[0-9]+(\.[0-9]+)+$/;

const isOid = value => {
  return isString(value) && oidRegExp.test(value);
};

export default isOid;
