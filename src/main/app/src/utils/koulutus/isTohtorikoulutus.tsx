import _ from 'lodash';

export const isTohtorikoulutus = (
  koulutusKoodiurit: Array<string> = [],
  tohtorikoulutukset: Array<string> = []
) => {
  const tohtorikoulutuskoodiurit = tohtorikoulutukset.map(
    koulutus => koulutus.koodiUri
  );
  const koulutuskoodiuritWithoutVersion = koulutusKoodiurit.flatMap(koodiuri =>
    koodiuri.split('#')
  );

  return !_.isEmpty(
    _.intersection(koulutuskoodiuritWithoutVersion, tohtorikoulutuskoodiurit)
  );
};
