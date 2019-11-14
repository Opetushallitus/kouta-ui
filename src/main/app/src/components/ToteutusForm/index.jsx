import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = (toteutusKieliFi, toteutusKieliSv)=> ({
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  tiedot: {
    nimi: {
      fi: toteutusKieliFi,
      sv: toteutusKieliSv
    }
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
