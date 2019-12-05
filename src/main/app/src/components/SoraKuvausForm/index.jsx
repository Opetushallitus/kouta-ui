import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
} from '../../constants';

export { default } from './SoraKuvausForm';

export const initialValues = (kieliValinnat) => ({
  tila: DEFAULT_JULKAISUTILA,
  koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: kieliValinnat,
});
