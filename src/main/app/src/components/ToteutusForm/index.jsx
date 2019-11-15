import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = (koulutusNimi)=> ({
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  tiedot: {
    nimi: koulutusNimi,
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
