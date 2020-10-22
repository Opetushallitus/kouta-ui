import _ from 'lodash/fp';
import { usePrevious } from 'react-use';

export const useHasChanged = (value, comparator = _.T) => {
  const previousValue = usePrevious(value);
  return value !== previousValue && comparator(value);
};
