import { KOULUTUSTYYPPI, POHJAVALINTA } from '../../constants';

export { default } from './SoraKuvausForm';

export const initialValues = {
  koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
};
