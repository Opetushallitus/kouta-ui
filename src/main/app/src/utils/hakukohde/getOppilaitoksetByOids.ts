import { useMemo } from 'react';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { defaultFilter } from '#/src/hooks/useOrganisaatioHierarkia';
import filterTree from '#/src/utils/filterTree';

export const getOppilaitoksetByOids = async ({
  tarjoajaOids,
  apiUrls,
  httpClient,
}) => {
  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.oppilaitokset-by-oids'),
    tarjoajaOids
  );

  return data || [];
};

export const useOppilaitoksetByOids = tarjoajaOids => {
  const { data, ...rest } = useApiQuery(
    'getOppilaitoksetByOids',
    getOppilaitoksetByOids,
    { tarjoajaOids },
    { ...LONG_CACHE_QUERY_OPTIONS }
  );

  const hierarkia = useMemo(
    () =>
      // TODO: Suodatetaan turhat organisaatiot pois jo kouta-backendissä, jolloin tätä ei tarvita
      filterTree(data?.organisaatioHierarkia.organisaatiot, org =>
        defaultFilter(org)
      ),
    [data]
  );

  const oppilaitokset = data?.oppilaitokset;
  return { hierarkia, oppilaitokset, ...rest };
};
