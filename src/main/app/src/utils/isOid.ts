import _ from 'lodash';

const oidRegExp = /^[0-9]+(\.[0-9]+)+$/;

const isOid = value => {
  return _.isString(value) && oidRegExp.test(value);
};

export default isOid;
