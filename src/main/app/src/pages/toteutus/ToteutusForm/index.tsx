import {
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
  ApurahaMaaraTyyppi,
  ApurahaYksikko,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

export { default } from './ToteutusForm';

export const initialValues = (koulutusNimi, koulutusKielet) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  kieliversiot: koulutusKielet,
  tiedot: {
    nimi: koulutusNimi,
  },
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  jarjestamistiedot: {
    maksullisuustyyppi: MaksullisuusTyyppi.MAKSUTON,
    apurahaMaaraTyyppi: ApurahaMaaraTyyppi.YKSI_ARVO,
    apurahaYksikko: { value: ApurahaYksikko.EURO },
  },
});
