import _ from 'lodash';

import { HAKUTAPA_YHTEISHAKU_KOODI_URI } from '#/src/constants';

const yhteishakuRegExp = new RegExp(HAKUTAPA_YHTEISHAKU_KOODI_URI);

const isYhteishakuHakutapa = hakutapa => {
  return _.isString(hakutapa) && yhteishakuRegExp.test(hakutapa);
};

export default isYhteishakuHakutapa;
