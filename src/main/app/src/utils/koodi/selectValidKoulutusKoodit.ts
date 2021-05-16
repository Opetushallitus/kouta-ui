import _fp from 'lodash/fp';
import { QueryObserverResult } from 'react-query';

import { isValidKoulutusKoodi } from './isValidKoulutusKoodi';

export const selectValidKoulutusKoodit = (
  response: QueryObserverResult | Array<QueryObserverResult> = []
) => {
  const koulutukset = _fp.isArray(response)
    ? response.flatMap((response: any) => {
        const data = response?.data?.data;
        return _fp.isArray(data) ? data : [];
      })
    : response?.data ?? [];

  return _fp.flow(
    _fp.filter(isValidKoulutusKoodi),
    _fp.groupBy('koodiUri'),
    _fp.map(_fp.maxBy('versio'))
  )(koulutukset);
};
