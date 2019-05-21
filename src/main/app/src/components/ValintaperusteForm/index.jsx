import { KOULUTUSTYYPPI, POHJAVALINTA } from '../../constants';

export { default } from './ValintaperusteForm';

export const initialValues = {
  tyyppi: {
    tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  },
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  pohja: {
    pohja: {
      tapa: POHJAVALINTA.UUSI,
    },
  },
  valintatapa: {
    valintatavat: [{}],
  },
};
