import { POHJAVALINTA } from '../../constants';

export const initialValues = {
  kieliversiot: ['fi', 'sv'],
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  aikataulut: {
    hakuaika: [{}],
  },
};

export { default } from './HakuForm';
