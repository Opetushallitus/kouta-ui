import { KOULUTUSTYYPPI, DIA_KOULUTUSKOODIURI } from '#/src/constants';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

export const isDIAkoulutus = (koulutuksetKoodiUri = [], koulutustyyppi) => {
  return (
    koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS &&
    koulutuksetKoodiUri
      .map(koodiuri => koodiUriWithoutVersion(koodiuri))
      .includes(DIA_KOULUTUSKOODIURI)
  );
};
