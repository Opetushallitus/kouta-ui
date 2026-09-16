import { isString } from 'lodash';

const koodiUriRegExp = /^haunkohdejoukko_12/;

const isKorkeakoulutusKohdejoukkoKoodiUri = value => {
  return isString(value) && koodiUriRegExp.test(value);
};

export default isKorkeakoulutusKohdejoukkoKoodiUri;
