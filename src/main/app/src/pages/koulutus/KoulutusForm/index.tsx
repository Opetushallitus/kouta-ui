import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '#/src/constants';

export { default } from './KoulutusForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
  tarjoajat: { tarjoajat: [], kaytaPohjanJarjestajaa: true },
};
