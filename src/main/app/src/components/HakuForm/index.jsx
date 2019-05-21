import { POHJAVALINTA } from '../../constants';

export const initialValues = {
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  pohja: {
    pohja: {
      tapa: POHJAVALINTA.UUSI,
    },
  },
  aikataulut: {
    hakuaika: [{}],
  },
};

export { default } from './HakuForm';
