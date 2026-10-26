import { intersection, isEmpty } from 'lodash-es';

import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';

export const isTohtorikoulutus = (
  koulutusKoodiurit: Array<string> = [],
  tohtorikoulutukset: Array<Koodi> = []
) => {
  const tohtorikoulutuskoodiurit = tohtorikoulutukset.map(
    koulutus => koulutus.koodiUri
  );

  const koulutuskoodiuritWithoutVersion = koulutusKoodiurit.map(koodiuri =>
    koodiUriWithoutVersion(koodiuri)
  );

  return !isEmpty(
    intersection(koulutuskoodiuritWithoutVersion, tohtorikoulutuskoodiurit)
  );
};
