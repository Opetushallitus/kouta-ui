import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
};
