import {
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
  ApurahaMaaraTyyppi,
  ApurahaYksikko,
} from '#/src/constants';

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
    apurahaMaaraTyyppi: ApurahaMaaraTyyppi.YKSI_ARVO,
    apurahaYksikko: { value: ApurahaYksikko.EURO },
  },
});
