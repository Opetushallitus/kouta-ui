import { isString } from 'lodash';

const erillishakuRegExp = /^hakutapa_02/;

const isErillishakuHakutapa = value => {
  return isString(value) && erillishakuRegExp.test(value);
};

export default isErillishakuHakutapa;
