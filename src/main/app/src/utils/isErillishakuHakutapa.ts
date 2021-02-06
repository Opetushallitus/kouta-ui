import _ from 'lodash';

const erillishakuRegExp = /^hakutapa_02/;

const isErillishakuHakutapa = value => {
  return _.isString(value) && erillishakuRegExp.test(value);
};

export default isErillishakuHakutapa;
