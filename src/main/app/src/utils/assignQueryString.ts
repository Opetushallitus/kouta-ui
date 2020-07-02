import qs from 'query-string';

const assignQueryString = (queryString, object) => {
  const queryObj = qs.parse(queryString);

  return qs.stringify({ ...queryObj, ...object });
};

export default assignQueryString;
