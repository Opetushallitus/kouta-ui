import { KOULUTUSTYYPPI, POHJAVALINTA } from '../../constants';

export { default } from './ValintaperusteForm';

export const initialValues = {
  tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  kieliversiot: ['fi', 'sv'],
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  valintatavat: [{}],
};
