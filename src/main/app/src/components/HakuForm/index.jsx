import { POHJAVALINNAT } from '../../constants';

export const initialValues = {
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  pohja: {
    pohja: {
      tapa: POHJAVALINNAT.UUSI,
    },
  },
  aikataulut: {
    hakuaika: [{}],
  },
};

export { default } from './HakuForm';
