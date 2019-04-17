import { KOULUTUSTYYPPI_CATEGORY, POHJAVALINNAT } from '../../constants';

export { default } from './KoulutusForm';

export const initialValues = {
  type: {
    type: KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
  },
  base: {
    pohja: {
      tapa: POHJAVALINNAT.UUSI,
    },
  },
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
};
