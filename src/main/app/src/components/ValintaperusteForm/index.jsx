import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';

export { default } from './ValintaperusteForm';

export const validate = values => {
  const errors = {};

  return errors;
};

export const initialValues = {
  tyyppi: {
    tyyppi: KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
  },
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
};
