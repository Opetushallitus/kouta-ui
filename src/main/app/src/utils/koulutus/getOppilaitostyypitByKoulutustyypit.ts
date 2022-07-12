import { useMemo } from 'react';

import _ from 'lodash';

import { PREVENT_REFETCH_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getOppilaitostyypitByKoulutustyypit = async ({
  apiUrls,
  httpClient,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.oppilaitostyypit-by-koulutustyypit'),
    {}
  );

  return data?.koulutustyypitToOppilaitostyypit || [];
};

type Mapping = {
  koulutustyyppi: string;
  oppilaitostyypit: Array<string>;
};

export const useOppilaitostyypitByKoulutustyypit = (options = {}) => {
  const { data, ...rest } = useApiQuery(
    'getOppilaitostyypitByKoulutustyypit',
    getOppilaitostyypitByKoulutustyypit,
    {},
    { ...PREVENT_REFETCH_QUERY_OPTIONS, ...options }
  );

  const oppilaitostyypitByKoulutustyypit = useMemo(() => {
    const mappings: Array<Mapping> = [];
    if (_.isArray(data)) {
      data.forEach((mapping: Mapping) =>
        mappings.push({
          koulutustyyppi: mapping.koulutustyyppi,
          oppilaitostyypit: mapping.oppilaitostyypit.map(
            oppilaitostyyppi => oppilaitostyyppi.split('#')[0]
          ),
        })
      );
    }
    return mappings;
  }, [data]);

  return { oppilaitostyypitByKoulutustyypit, ...rest };
};
