import { useMemo } from 'react';

import _ from 'lodash';

import { getCombinedQueryStatus } from '#/src/components/QueryResultWrapper';
import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP,
  LONG_CACHE_QUERY_OPTIONS,
  LUKIO_KOULUTUSKOODIURIT,
} from '#/src/constants';
import { useApiQueries } from '#/src/hooks/useApiQuery';
import getKoodisto from '#/src/utils/koodi/getKoodisto';
import {
  getSisaltyyYlakoodit,
  GET_SISALTYY_YLAKOODIT_QUERY_KEY,
} from '#/src/utils/koodi/getSisaltyyYlakoodit';
import { selectValidKoulutusKoodit } from '#/src/utils/koodi/selectValidKoulutusKoodit';

import { GET_KOODISTO_QUERY_KEY } from './useKoodisto';

export const useKoulutuksetByKoulutustyyppi = koulutustyyppi => {
  const koodiUrit = KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP[koulutustyyppi];

  const queryProps = useMemo(
    () =>
      _.isNil(koodiUrit) || koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS
        ? [
            {
              key: GET_KOODISTO_QUERY_KEY,
              queryFn: getKoodisto,
              props: {
                koodistoUri: 'koulutus',
              },
              ...LONG_CACHE_QUERY_OPTIONS,
            },
          ]
        : _.castArray(koodiUrit)?.map(koodiUri => ({
            key: GET_SISALTYY_YLAKOODIT_QUERY_KEY,
            queryFn: getSisaltyyYlakoodit,
            props: {
              koodiUri,
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
