import { POHJAVALINTA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = {
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  base: {
    pohja: {
      tapa: POHJAVALINTA.UUSI,
    },
  },
};
