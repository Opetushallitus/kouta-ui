import { useContext } from 'react';

import { isNil } from 'lodash';

export const valueOrThrow = (val, errorMessage) => {
  if (isNil(val)) {
    throw new Error(errorMessage);
  }
  return val;
};

export const useContextOrThrow = Context => {
  const ctx = useContext(Context);
  return valueOrThrow(
    ctx,
    `Trying to use context "${Context.displayName}" outside provider!`
  );
};
