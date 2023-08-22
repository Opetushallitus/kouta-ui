import { getYear } from 'date-fns';
import _ from 'lodash';

const YEAR_PADDING = 2;

export const getKoulutuksenAlkamisvuosiOptions = () => {
  const thisYear = getYear(new Date());

  return _.range(thisYear - YEAR_PADDING, thisYear + YEAR_PADDING + 1)
    .sort((a, b) => a - b)
    .map(year => {
      const yearStr = year.toString();
      return {
        label: yearStr,
        value: yearStr,
      };
    });
};
