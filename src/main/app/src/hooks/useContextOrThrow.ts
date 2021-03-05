import { useContext } from 'react';

import _ from 'lodash';

export const valueOrThrow = (val, errorMessage) => {
  if (_.isNil(val)) {
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
