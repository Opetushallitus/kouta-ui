import { HAKUTAPA_YHTEISHAKU_KOODI_URI } from '../constants';

const yhteishakuRegExp = new RegExp(HAKUTAPA_YHTEISHAKU_KOODI_URI);

const isYhteishakuHakutapa = hakutapa => {
  return yhteishakuRegExp.test(hakutapa);
};

export default isYhteishakuHakutapa;
