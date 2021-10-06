import { TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT } from '../constants';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';

const isRestrictedDuetoYhteishaku = (hakutapaKoodiUri, koulutustyyppi) => {
  if (isYhteishakuHakutapa(hakutapaKoodiUri)) {
    return TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT.includes(koulutustyyppi);
  }
  return false;
};
export default isRestrictedDuetoYhteishaku;
