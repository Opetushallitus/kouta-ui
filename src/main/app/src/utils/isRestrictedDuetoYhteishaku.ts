import { KOULUTUSTYYPPI } from '../constants';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';

// TODO Lisää TELMA ja VAPAA_SIVISTYSTYO (oppivelvollisuuslinja / opistovuosi),
// Kun niitä aletaan tukemaan
const RESTRICTED_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
  KOULUTUSTYYPPI.TUVA,
  //KOULUTUSTYYPPI.TELMA,
  //KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO
];

const isRestrictedDuetoYhteishaku = (hakutapaKoodiUri, koulutustyyppi) => {
  if (isYhteishakuHakutapa(hakutapaKoodiUri)) {
    return RESTRICTED_KOULUTUSTYYPIT.includes(koulutustyyppi);
  }
  return false;
};
export default isRestrictedDuetoYhteishaku;
