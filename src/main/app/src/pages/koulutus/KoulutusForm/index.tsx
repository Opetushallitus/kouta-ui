import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  DEFAULT_JULKAISUTILA,
} from '#/src/constants';

export { default } from './KoulutusForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
  tarjoajat: [],
};
