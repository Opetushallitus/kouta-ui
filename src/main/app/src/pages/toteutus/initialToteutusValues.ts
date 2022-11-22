import {
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
  MaaraTyyppi,
  ApurahaYksikko,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

export const initialValues = ({
  koulutustyyppi,
  koulutusNimi,
  koulutusKielet,
  avoinKorkeakoulutus,
  tunniste,
  opinnonTyyppiKoodiUri,
}) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: true,
  kieliversiot: koulutusKielet,
  tiedot: {
    nimi: koulutusNimi,
    avoinKorkeakoulutus,
    tunniste,
    opinnonTyyppi: { value: opinnonTyyppiKoodiUri },
  },
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  jarjestamistiedot: {
    maksullisuustyyppi: MaksullisuusTyyppi.MAKSUTON,
    apurahaMaaraTyyppi: MaaraTyyppi.YKSI_ARVO,
    apurahaYksikko: { value: ApurahaYksikko.EURO },
    suunniteltuKesto: { vuotta: 0, kuukautta: 0 },
  },
  ...(koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS
    ? {
        lukiolinjat: {
          yleislinja: true,
        },
      }
    : {}),
});
