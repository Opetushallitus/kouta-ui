import { HAKUTAPA_YHTEISHAKU_KOODI_URI } from '../constants';
import { isString } from './index';

const yhteishakuRegExp = new RegExp(HAKUTAPA_YHTEISHAKU_KOODI_URI);

const isYhteishakuHakutapa = hakutapa => {
  return isString(hakutapa) && yhteishakuRegExp.test(hakutapa);
};

export default isYhteishakuHakutapa;
