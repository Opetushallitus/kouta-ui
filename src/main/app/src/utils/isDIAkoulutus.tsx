import {
  KOULUTUSTYYPPI,
  DIA_KOULUTUSKOODIURI,
  Koulutustyyppi,
} from '#/src/constants';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

export const isDIAkoulutus = (
  koulutuksetKoodiUri: Array<string> = [],
  koulutustyyppi: Koulutustyyppi
) => {
  return (
    koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
    koulutuksetKoodiUri
      .map(koodiuri => koodiUriWithoutVersion(koodiuri))
      .includes(DIA_KOULUTUSKOODIURI)
  );
};
