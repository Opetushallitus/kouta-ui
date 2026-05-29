import { Context, useContext } from 'react';

import _ from 'lodash';

export const valueOrThrow = <T>(
  val: T | null | undefined,
  errorMessage: string
): NonNullable<T> => {
  if (_.isNil(val)) {
    throw new Error(errorMessage);
  }
  return val as NonNullable<T>;
};

export const useContextOrThrow = <T>(context: Context<T | undefined>): T => {
  const ctx = useContext(context);
  return valueOrThrow(
    ctx,
    `Trying to use context "${context.displayName}" outside provider!`
  );
};
