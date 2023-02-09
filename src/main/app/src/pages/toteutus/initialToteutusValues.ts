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
  isAvoinKorkeakoulutus,
  tunniste,
  opinnonTyyppiKoodiUri,
  koulutusOpintojenLaajuusNumero,
}) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: true,
  kieliversiot: koulutusKielet,
  tiedot: {
    nimi: koulutusNimi,
    isAvoinKorkeakoulutus,
    tunniste,
    opinnonTyyppi: { value: opinnonTyyppiKoodiUri },
    opintojenLaajuusNumero:
      koulutustyyppi === KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS
        ? koulutusOpintojenLaajuusNumero
        : undefined,
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
