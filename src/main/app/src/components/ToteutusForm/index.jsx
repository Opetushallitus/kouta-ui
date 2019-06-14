import { POHJAVALINTA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = {
  kieliversiot: ['fi', 'sv'],
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
};
