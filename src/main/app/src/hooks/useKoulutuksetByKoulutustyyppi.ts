import { useMemo } from 'react';

import _ from 'lodash';

import { getCombinedQueryStatus } from '#/src/components/WithQueryIndicators';
import {
  KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP,
  LONG_CACHE_QUERY_OPTIONS,
} from '#/src/constants';
import { useApiQueries } from '#/src/hooks/useApiQuery';
import {
  getSisaltyyYlakoodit,
  GET_SISALTYY_YLAKOODIT_KEY,
} from '#/src/utils/koodi/getSisaltyyYlakoodit';
import { selectValidKoulutusKoodit } from '#/src/utils/koodi/selectValidKoulutusKoodit';

export const useKoulutuksetByKoulutustyyppi = koulutustyyppi => {
  const koodiUrit = _.castArray(
    KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP[koulutustyyppi]
  );

  const queryProps = useMemo(
    () =>
      koodiUrit?.map(koodiUri => ({
        key: GET_SISALTYY_YLAKOODIT_KEY,
        queryFn: getSisaltyyYlakoodit,
        props: { koodiUri },
        ...LONG_CACHE_QUERY_OPTIONS,
      })),
    [koodiUrit]
  );

  const responses = useApiQueries(queryProps);

  const koulutukset = useMemo(() => selectValidKoulutusKoodit(responses), [
    responses,
  ]);

  const status = getCombinedQueryStatus(responses);

  return { data: koulutukset, isLoading: status === 'loading' };
};
