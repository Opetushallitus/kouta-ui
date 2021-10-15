import getYear from 'date-fns/getYear';

import { DEFAULT_JULKAISUTILA } from '#/src/constants';

import { checkHasHakukohdeKoodiUri } from './PerustiedotSection';

export { HakukohdeForm } from './HakukohdeForm';

export const initialValues = (koulutustyyppi, toteutus, haku) => ({
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  kieliversiot: toteutus?.kielivalinta,
  perustiedot: checkHasHakukohdeKoodiUri(koulutustyyppi, haku)
    ? {}
    : {
        nimi: toteutus?.nimi,
      },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
});
