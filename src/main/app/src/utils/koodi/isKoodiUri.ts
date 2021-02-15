import _ from 'lodash';

const koodiUriRegExp = /^\w+_[\w-]+(#[0-9]+)?$/;

const isKoodiUri = value => _.isString(value) && koodiUriRegExp.test(value);

export default isKoodiUri;
