import getYear from 'date-fns/getYear';

import { DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './HakukohdeForm';

export const initialValues = (toteutusNimi) => ({
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  tiedot: {
    nimi: toteutusNimi,
  },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
});
