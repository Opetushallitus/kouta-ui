import {
  DEFAULT_JULKAISUTILA,
  MaaraTyyppi,
  POHJAVALINTA,
} from '#/src/constants';

export const initialKoulutusValues = {
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
  tarjoajat: { tarjoajat: [], kaytaPohjanJarjestajaa: false },
  information: {
    laajuusNumeroTyyppi: MaaraTyyppi.VAIHTELUVALI,
  },
};
