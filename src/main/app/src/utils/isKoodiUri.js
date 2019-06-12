import { isString } from './index';

const isKoodiUri = value =>
  isString(value) && /^\w+_\w+(#[0-9]+)?$/.test(value);

export default isKoodiUri;
