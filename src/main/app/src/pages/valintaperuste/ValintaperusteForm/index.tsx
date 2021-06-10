import _ from 'lodash';

import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '#/src/constants';

export { ValintaperusteForm } from './ValintaperusteForm';

export const initialValues = (kieliValinnat, koulutustyyppi) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  perustiedot: {
    tyyppi: koulutustyyppi,
    kieliversiot: _.isEmpty(kieliValinnat) ? ['fi'] : kieliValinnat,
  },
  valintatavat: [{}],
});
