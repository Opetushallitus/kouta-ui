import { useMemo } from 'react';

import _ from 'lodash';

import { getCombinedQueryStatus } from '#/src/components/WithQueryIndicators';
import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP,
  LONG_CACHE_QUERY_OPTIONS,
  LUKIO_KOULUTUSKOODIURIT,
} from '#/src/constants';
import { useApiQueries } from '#/src/hooks/useApiQuery';
import {
  getSisaltyyYlakoodit,
  GET_SISALTYY_YLAKOODIT_KEY,
} from '#/src/utils/koodi/getSisaltyyYlakoodit';
import { selectValidKoulutusKoodit } from '#/src/utils/koodi/selectValidKoulutusKoodit';

export const useKoulutuksetByKoulutustyyppi = koulutustyyppi => {
  const koodiUrit = KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP[koulutustyyppi];

  const queryProps = useMemo(
    () =>
      _.castArray(koodiUrit)?.map(koodiUri => ({
        key: GET_SISALTYY_YLAKOODIT_KEY,
        queryFn: getSisaltyyYlakoodit,
        props: {
          koodiUri:
            koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS ? null : koodiUri,
        },
        ...LONG_CACHE_QUERY_OPTIONS,
      })),
    [koodiUrit, koulutustyyppi]
  );

  const responses = useApiQueries(queryProps);

  const koulutukset = useMemo(() => {
    const koulutusKoodit = selectValidKoulutusKoodit(responses);
    return koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS
      ? koulutusKoodit?.filter(k =>
          LUKIO_KOULUTUSKOODIURIT.includes(k.koodiUri)
        )
      : koulutusKoodit;
  }, [responses, koulutustyyppi]);

  const status = getCombinedQueryStatus(responses);

  return { data: koulutukset, isLoading: status === 'loading' };
};
