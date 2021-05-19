import { isBefore, parseISO, endOfToday } from 'date-fns';
import _ from 'lodash';

export const isValidKoulutusKoodi = ({ koodisto, voimassaLoppuPvm }) =>
  koodisto?.koodistoUri === 'koulutus' &&
  (_.isNil(voimassaLoppuPvm) ||
    isBefore(endOfToday(), parseISO(voimassaLoppuPvm)));
