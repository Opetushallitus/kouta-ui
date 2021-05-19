import { DEFAULT_JULKAISUTILA, POHJAVALINTA } from '#/src/constants';

export const initialKoulutusValues = {
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
  tarjoajat: { tarjoajat: [], kaytaPohjanJarjestajaa: true },
};
