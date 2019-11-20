import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
} from '../../constants';

export { default } from './ValintaperusteForm';

export const initialValues = (kieliValinnat) => ({
  tila: DEFAULT_JULKAISUTILA,
  tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  kieliversiot: kieliValinnat,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  valintatavat: [{}],
});
