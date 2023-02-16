import {
  KOULUTUSTYYPPI,
  EB_KOULUTUSKOODIURI,
  Koulutustyyppi,
} from '#/src/constants';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

export const isEBkoulutus = (
  koulutuksetKoodiUri: Array<string> = [],
  koulutustyyppi: Koulutustyyppi
) => {
  return (
    koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
    koulutuksetKoodiUri
      .map(koodiuri => koodiUriWithoutVersion(koodiuri))
      .includes(EB_KOULUTUSKOODIURI)
  );
};
