import { usePrevious } from 'react-use';

const defaultComparator = (value, previousValue) => value === previousValue;

export const useHasChanged = (value, comparator = defaultComparator) => {
  const previousValue = usePrevious(value);
  return !comparator(value, previousValue);
};
