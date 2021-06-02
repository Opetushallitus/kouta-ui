import getYear from 'date-fns/getYear';

import { DEFAULT_JULKAISUTILA } from '#/src/constants';

export { HakukohdeForm } from './HakukohdeForm';

export const initialValues = (toteutusNimi, toteutusKielet) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  kieliversiot: toteutusKielet,
  perustiedot: {
    nimi: toteutusNimi,
  },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
});
