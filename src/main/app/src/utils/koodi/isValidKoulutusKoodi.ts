import { isBefore, parseISO, endOfToday } from 'date-fns';
import _ from 'lodash';

export const isValidKoulutusKoodi = ({
  koodiArvo,
  koodisto,
  voimassaLoppuPvm,
}) =>
  koodisto?.koodistoUri === 'koulutus' &&
  !koodiArvo.endsWith('00') && // suodatetaan pois väliotsikot
  (_.isNil(voimassaLoppuPvm) ||
    isBefore(endOfToday(), parseISO(voimassaLoppuPvm)));
