import { isBefore, parseISO, endOfToday } from 'date-fns';
import { isNil } from 'lodash-es';

export const isValidKoulutusKoodi = ({
  koodiArvo,
  koodisto,
  voimassaLoppuPvm,
}) =>
  koodisto?.koodistoUri === 'koulutus' &&
  !koodiArvo.endsWith('00') && // suodatetaan pois väliotsikot
  (isNil(voimassaLoppuPvm) ||
    isBefore(endOfToday(), parseISO(voimassaLoppuPvm)));
