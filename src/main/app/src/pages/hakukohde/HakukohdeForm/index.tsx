import getYear from 'date-fns/getYear';

import { DEFAULT_JULKAISUTILA } from '#/src/constants';

export { default } from './HakukohdeForm';

export const initialValues = (toteutusNimi, toteutusKielet) => ({
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: toteutusKielet,
  perustiedot: {
    nimi: toteutusNimi,
  },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
});
