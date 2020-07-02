import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '../../constants';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
};

export { default } from './HakuForm';
