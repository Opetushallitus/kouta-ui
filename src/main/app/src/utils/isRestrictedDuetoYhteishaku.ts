import { KOULUTUSTYYPPI } from '../constants';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';

const RESTRICTED_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
  KOULUTUSTYYPPI.TUVA,
  KOULUTUSTYYPPI.TELMA,
  KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
];

const isRestrictedDuetoYhteishaku = (hakutapaKoodiUri, koulutustyyppi) => {
  if (isYhteishakuHakutapa(hakutapaKoodiUri)) {
    return RESTRICTED_KOULUTUSTYYPIT.includes(koulutustyyppi);
  }
  return false;
};
export default isRestrictedDuetoYhteishaku;
