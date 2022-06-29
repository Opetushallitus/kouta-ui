import { KOULUTUSTYYPPI, EB_KOULUTUSKOODIURI } from '#/src/constants';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

export const isEBkoulutus = (koulutuksetKoodiUri = [], koulutustyyppi) => {
  return (
    koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
    koulutuksetKoodiUri
      .map(koodiuri => koodiUriWithoutVersion(koodiuri))
      .includes(EB_KOULUTUSKOODIURI)
  );
};
