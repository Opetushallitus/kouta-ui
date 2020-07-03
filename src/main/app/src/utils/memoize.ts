import memoizee from 'memoizee';

export const memoize = (fn, opts = {}) => memoizee(fn, { max: 100, ...opts });

export const memoizeOne = fn => memoizee(fn, { max: 1 });

export const memoizePromise = (fn, opts = {}) =>
  memoizee(fn, { promise: true, ...opts });
