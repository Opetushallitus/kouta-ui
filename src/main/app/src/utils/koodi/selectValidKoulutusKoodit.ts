import { filter, flow, groupBy, map, maxBy } from 'lodash-es';
import { QueryObserverResult } from 'react-query';

import { isValidKoulutusKoodi } from './isValidKoulutusKoodi';

export const selectValidKoulutusKoodit = (
  response: { data } | QueryObserverResult | Array<QueryObserverResult> = []
) => {
  const koulutukset = Array.isArray(response)
    ? response.flatMap((response: any) => {
        const data = response?.data;
        return Array.isArray(data) ? data : [];
      })
    : (response?.data ?? []);

  return flow(
    (arr: typeof koulutukset) => filter(arr, isValidKoulutusKoodi),
    arr => groupBy(arr, 'koodiUri'),
    grouped => map(grouped, arr => maxBy(arr, 'versio'))
  )(koulutukset);
};
