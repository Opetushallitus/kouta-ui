import { KOULUTUSTYYPPI_CATEGORY, POHJAVALINNAT } from '../../constants';

export { default } from './SoraKuvausForm';

export const initialValues = {
  koulutustyyppi: KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
  pohja: {
    tapa: POHJAVALINNAT.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
};
