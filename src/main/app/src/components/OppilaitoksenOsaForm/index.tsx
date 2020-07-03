import { DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './OppilaitoksenOsaForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
};
