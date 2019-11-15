import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = (toteutusNimi)=> ({
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  tiedot: {
    nimi: toteutusNimi,
  },
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
});

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});
