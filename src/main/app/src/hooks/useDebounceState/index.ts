import { useState, useEffect, useRef, useCallback } from 'react';

import _ from 'lodash';

export const useDebounceState = (initialValue = null, wait = 0) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  const debounceRef = useRef();

  useEffect(() => {
    debounceRef.current = _.debounce(newValue => {
      setDebouncedValue(newValue);
    }, wait);

    return () => debounceRef.current.cancel();
  }, [wait]);

  const setValueFn = useCallback(
    newValue => {
      setValue(newValue);
      debounceRef.current(newValue);
    },
    [setValue]
  );

  return [value, setValueFn, debouncedValue];
};

export default useDebounceState;
