import { DEFAULT_JULKAISUTILA } from '#/src/constants';

export { default } from './OppilaitosForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  kieliversiot: ['fi', 'sv'],
};
