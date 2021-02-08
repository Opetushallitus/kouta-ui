import { useMemo } from 'react';

import debounce from 'debounce-promise';
import _ from 'lodash';

const getMatchingOptions = (options: SelectOptions, input, maxMatches) => {
  let matches: SelectOptions = [];

  if (!_.isString(input)) {
    return matches;
  }

  // eslint-disable-next-line no-unused-vars
  for (const opt of options) {
    if (
      _.isString(opt.label) &&
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
  options?: SelectOptions,
  { debounce: debounceTime = 500, maxOptions = 100 } = {}
) => {
  return useMemo(() => {
    if (options && options?.length !== 0) {
      return debounce(
        inputValue => getMatchingOptions(options, inputValue, maxOptions),
        debounceTime
      );
    }
  }, [options, debounceTime, maxOptions]);
};

export default useLoadOptions;
