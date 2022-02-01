import qs from 'query-string';

export const assignQueryString = (queryString, object) => {
  const queryObj = qs.parse(queryString);

  return qs.stringify({ ...queryObj, ...object });
};
