import { isString } from 'lodash';

const koodiUriRegExp = /^\w+_\w+(#[0-9]+)?$/;

const isKoodiUri = value => isString(value) && koodiUriRegExp.test(value);

export default isKoodiUri;
