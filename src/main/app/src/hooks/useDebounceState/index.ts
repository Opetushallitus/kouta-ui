import { useState } from 'react';

import { useDebounce } from 'react-use';

export const useDebounceState = (initialValue, wait = 0) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useDebounce(() => setDebouncedValue(value), wait, [wait, value]);

  return [value, setValue, debouncedValue];
};
