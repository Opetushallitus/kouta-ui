import isYhteishakuHakutapa from './isYhteishakuHakutapa';
import { TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT } from '../constants';

export const isToisenAsteenYhteishaku = (hakutapaKoodiUri, koulutustyyppi) =>
  isYhteishakuHakutapa(hakutapaKoodiUri) &&
  TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT.includes(koulutustyyppi);
