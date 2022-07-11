import getYear from 'date-fns/getYear';

import { 
  DEFAULT_JULKAISUTILA,
  POHJAVALINTA 
} from '#/src/constants';

import { checkHasHakukohdeKoodiUri } from './PerustiedotSection';

export { HakukohdeForm } from './HakukohdeForm';

export const initialValues = (koulutustyyppi, toteutus, haku, oid) => ({
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
  pohja: {
    tapa: oid ? POHJAVALINTA.KOPIO : POHJAVALINTA.UUSI,
    valinta: oid ? { value: oid } : null,
  }
});
