import { useMemo } from 'react';

import _ from 'lodash';

import { getCombinedQueryStatus } from '#/src/components/QueryResultWrapper';
import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP,
  LONG_CACHE_QUERY_OPTIONS,
  LUKIO_KOULUTUSKOODIURIT,
  AMM_OPETTAJA_ERIKOISOPETTAJA_OPO_KOULUTUSKOODIURIT,
  ERIKOISLAAKARI_KOULUTUSKOODIURIT,
} from '#/src/constants';
import { useApiQueries } from '#/src/hooks/useApiQuery';
import getKoodisto from '#/src/utils/koodi/getKoodisto';
import {
  getSisaltyyYlakoodit,
  GET_SISALTYY_YLAKOODIT_QUERY_KEY,
} from '#/src/utils/koodi/getSisaltyyYlakoodit';
import { selectValidKoulutusKoodit } from '#/src/utils/koodi/selectValidKoulutusKoodit';

import { GET_KOODISTO_QUERY_KEY } from './useKoodisto';

const KOULUTUSTYYPPI_KOODIURIT_MAPPING = {
  [KOULUTUSTYYPPI.LUKIOKOULUTUS]: LUKIO_KOULUTUSKOODIURIT,
  [KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS]:
    AMM_OPETTAJA_ERIKOISOPETTAJA_OPO_KOULUTUSKOODIURIT,
  [KOULUTUSTYYPPI.ERIKOISLAAKARI]: ERIKOISLAAKARI_KOULUTUSKOODIURIT,
};

export const useKoulutuksetByKoulutustyyppi = (
  koulutustyyppi: KOULUTUSTYYPPI
) => {
  const ylaKoodiUrit = KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP[koulutustyyppi];

  const queryProps = useMemo(
    () =>
      _.isNil(ylaKoodiUrit) ||
      _.keys(KOULUTUSTYYPPI_KOODIURIT_MAPPING).includes(koulutustyyppi)
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
        : _.castArray(ylaKoodiUrit)?.map(koodiUri => ({
            key: GET_SISALTYY_YLAKOODIT_QUERY_KEY,
            queryFn: getSisaltyyYlakoodit,
            props: {
              koodiUri,
            },
            ...LONG_CACHE_QUERY_OPTIONS,
          })),
    [ylaKoodiUrit, koulutustyyppi]
  );

  const responses = useApiQueries(queryProps);
  const koulutukset = useMemo(() => {
    const koulutusKoodit = selectValidKoulutusKoodit(responses);
    const wantedKoodiUrit = KOULUTUSTYYPPI_KOODIURIT_MAPPING[koulutustyyppi];

    return wantedKoodiUrit
      ? koulutusKoodit?.filter(k => wantedKoodiUrit.includes(k.koodiUri))
      : koulutusKoodit;
  }, [responses, koulutustyyppi]);

  const status = getCombinedQueryStatus(responses);

  return { data: koulutukset, isLoading: status === 'loading' };
};
