import getYear from 'date-fns/getYear';

import {
  DEFAULT_JULKAISUTILA,
  TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT,
} from '#/src/constants';

export { HakukohdeForm } from './HakukohdeForm';

export const initialValues = (koulutustyyppi, toteutus) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  kieliversiot: toteutus?.kielivalinta,
  perustiedot: TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT.includes(koulutustyyppi)
    ? {}
    : {
        nimi: toteutus?.nimi,
      },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
});
