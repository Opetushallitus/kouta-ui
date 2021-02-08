import _fp from 'lodash/fp';
import { usePrevious } from 'react-use';

export const useHasChanged = (value, comparator = _fp.T) => {
  const previousValue = usePrevious(value);
  return value !== previousValue && comparator(value);
};
