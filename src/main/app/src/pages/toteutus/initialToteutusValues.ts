import {
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
  MaaraTyyppi,
  ApurahaYksikko,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

export const initialValues = ({ koulutus }) => {
  const koulutustyyppi = koulutus?.koulutustyyppi;
  const koulutusKielet = koulutus?.kielivalinta;
  const isAvoinKorkeakoulutus = koulutus?.metadata?.isAvoinKorkeakoulutus;
  const tunniste = koulutus?.metadata?.tunniste;
  const opinnonTyyppiKoodiUri = koulutus?.metadata?.opinnonTyyppiKoodiUri;
  const opintojenLaajuusNumeroMin =
    koulutus?.metadata?.opintojenLaajuusNumeroMin;
  const opintojenLaajuusNumeroMax =
    koulutus?.metadata?.opintojenLaajuusNumeroMax;
  const opintojenLaajuusyksikkoKoodiUri =
    koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri;

  const opintojenLaajuusNumero =
    koulutus?.metadata?.opintojenLaajuusNumeroMin ===
    koulutus?.metadata?.opintojenLaajuusNumeroMax
      ? koulutus?.metadata?.opintojenLaajuusNumeroMin
      : '';

  return {
    tila: DEFAULT_JULKAISUTILA,
    esikatselu: true,
    kieliversiot: koulutusKielet,
    tiedot: {
      nimi: [
        KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
        KOULUTUSTYYPPI.TUTKINNON_OSA,
        KOULUTUSTYYPPI.OSAAMISALA,
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
        KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
        KOULUTUSTYYPPI.MUU,
      ].includes(koulutustyyppi)
        ? koulutus?.nimi
        : null,
      isAvoinKorkeakoulutus,
      tunniste,
      opinnonTyyppi: { value: opinnonTyyppiKoodiUri },
      opintojenLaajuusNumero: [
        KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
        KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
      ].includes(koulutustyyppi)
        ? opintojenLaajuusNumero
        : undefined,
      ...(koulutustyyppi === KOULUTUSTYYPPI.MUU
        ? {
            laajuusNumeroTyyppi:
              opintojenLaajuusNumeroMin === opintojenLaajuusNumeroMax
                ? MaaraTyyppi.YKSI_ARVO
                : MaaraTyyppi.VAIHTELUVALI,
            opintojenLaajuusNumeroMin: opintojenLaajuusNumeroMin,
            opintojenLaajuusNumeroMax: opintojenLaajuusNumeroMax,
            opintojenLaajuusyksikko: { value: opintojenLaajuusyksikkoKoodiUri },
          }
        : {}),
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
  };
};
