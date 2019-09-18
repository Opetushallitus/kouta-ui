import { useMemo } from 'react';
import debounce from 'debounce-promise';

const getMatchingOptions = (options, input, maxMatches) => {
  let matches = [];

  // eslint-disable-next-line no-unused-vars
  for (const opt of options) {
    if (opt.label && opt.label.indexOf(input) >= 0) {
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
