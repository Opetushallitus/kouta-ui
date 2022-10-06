import {
  DEFAULT_JULKAISUTILA,
  MaaraTyyppi,
  POHJAVALINTA,
} from '#/src/constants';

export const initialKoulutusValues = {
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: true,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
  tarjoajat: { tarjoajat: [], kaytaPohjanJarjestajaa: false },
  information: {
    laajuusNumeroTyyppi: MaaraTyyppi.VAIHTELUVALI,
  },
};
