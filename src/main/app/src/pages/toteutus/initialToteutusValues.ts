import {
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
  ApurahaMaaraTyyppi,
  ApurahaYksikko,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

export const initialValues = ({
  koulutustyyppi,
  koulutusNimi,
  koulutusKielet,
}) => ({
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
  ...(koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS
    ? {
        lukiolinjat: {
          yleislinja: true,
        },
      }
    : {}),
});
