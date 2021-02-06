import _ from 'lodash';

const koodiUriRegExp = /^haunkohdejoukko_12/;

const isKorkeakoulutusKohdejoukkoKoodiUri = value => {
  return _.isString(value) && koodiUriRegExp.test(value);
};

export default isKorkeakoulutusKohdejoukkoKoodiUri;
