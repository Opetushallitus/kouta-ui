import { KOULUTUSTYYPPI_CATEGORY, POHJAVALINNAT } from '../../constants';

export { default } from './ValintaperusteForm';

export const initialValues = {
  tyyppi: {
    tyyppi: KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
  },
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  pohja: {
    pohja: {
      tapa: POHJAVALINNAT.UUSI,
    },
  },
  valintatapa: {
    valintatavat: [{}],
  },
};
