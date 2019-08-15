import memoize from 'memoizee';

const memoizeOne = fn => memoize(fn, { max: 1 });

export default memoizeOne;
