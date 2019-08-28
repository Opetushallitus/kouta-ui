import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
} from '../../constants';

export { default } from './ValintaperusteForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  kieliversiot: ['fi', 'sv'],
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  valintatavat: [{}],
};
