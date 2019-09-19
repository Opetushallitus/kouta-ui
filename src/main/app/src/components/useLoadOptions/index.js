import { useMemo } from 'react';
import debounce from 'debounce-promise';

import { isString } from '../../utils';

const getMatchingOptions = (options, input, maxMatches) => {
  let matches = [];

  if (!isString(input)) {
    return matches;
  }

  // eslint-disable-next-line no-unused-vars
  for (const opt of options) {
    if (
      isString(opt.label) &&
      opt.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    ) {
      matches.push(opt);
    }

    if (matches.length === maxMatches) {
      break;
    }
  }

  return matches;
};

const useLoadOptions = (
  options = [],
  { debounce: debounceTime = 500, maxOptions = 100 } = {},
) => {
  return useMemo(() => {
    const loadDebounce = debounce(inputValue => {
      return getMatchingOptions(options, inputValue, maxOptions);
    }, debounceTime);

    return loadDebounce;
  }, [options, debounceTime, maxOptions]);
};

export default useLoadOptions;
