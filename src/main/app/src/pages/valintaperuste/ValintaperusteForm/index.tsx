import { isEmpty } from 'lodash';
import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
} from '#/src/constants';

export { default } from './ValintaperusteForm';

export const initialValues = kieliValinnat => ({
  tila: DEFAULT_JULKAISUTILA,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  perustiedot: {
    tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    kieliversiot: isEmpty(kieliValinnat) ? ['fi'] : kieliValinnat,
  },
  valintatavat: [{}],
});
