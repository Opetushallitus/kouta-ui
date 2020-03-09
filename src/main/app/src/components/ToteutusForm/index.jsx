import { POHJAVALINTA, DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './ToteutusForm';

export const initialValues = (koulutusNimi, koulutusKielet) => ({
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: koulutusKielet,
  tiedot: {
    nimi: koulutusNimi,
  },
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
});
