import { TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT } from '../constants';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';

export const isToisenAsteenYhteishaku = (hakutapaKoodiUri, koulutustyyppi) =>
  isYhteishakuHakutapa(hakutapaKoodiUri) &&
  TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT.includes(koulutustyyppi);
