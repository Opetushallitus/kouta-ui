import { KOULUTUSTYYPPI, POHJAVALINTA } from '../../constants';

export { default } from './KoulutusForm';

export const initialValues = {
  type: {
    type: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  },
  base: {
    pohja: {
      tapa: POHJAVALINTA.UUSI,
    },
  },
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
};
