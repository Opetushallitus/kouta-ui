import getYear from 'date-fns/getYear';

import { DEFAULT_JULKAISUTILA, KOULUTUSTYYPPI } from '#/src/constants';

export { HakukohdeForm } from './HakukohdeForm';

export const initialValues = (koulutustyyppi, toteutus) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  kieliversiot: toteutus?.kielivalinta,
  perustiedot:
    koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS
      ? {}
      : {
          nimi: toteutus?.nimi,
        },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
});
