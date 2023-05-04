import _ from 'lodash';

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

  return !_.isEmpty(
    _.intersection(koulutuskoodiuritWithoutVersion, tohtorikoulutuskoodiurit)
  );
};
