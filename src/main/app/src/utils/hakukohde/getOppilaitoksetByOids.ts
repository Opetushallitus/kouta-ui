import { useMemo } from 'react';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { defaultFilter } from '#/src/hooks/useOrganisaatioHierarkia';
import { type HttpClient } from '#/src/httpClient';
import { type OppilaitoksetResponseModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';
import filterTree from '#/src/utils/filterTree';

export const getOppilaitoksetByOids = async ({
  tarjoajaOids,
  apiUrls,
  httpClient,
}: {
  tarjoajaOids: Array<string>;
  apiUrls: ApiUrls;
  httpClient: HttpClient;
}) => {
  const { data } = await httpClient.post<OppilaitoksetResponseModel>(
    apiUrls.url('kouta-backend.oppilaitokset-by-oids'),
    tarjoajaOids
  );

  return data || [];
};

export const useOppilaitoksetByOids = (tarjoajaOids: Array<string>) => {
  const { data, ...rest } = useApiQuery(
    'getOppilaitoksetByOids',
    getOppilaitoksetByOids,
    { tarjoajaOids },
    { ...LONG_CACHE_QUERY_OPTIONS }
  );

  const hierarkia = useMemo(
    () =>
      // TODO: Suodatetaan turhat organisaatiot pois jo kouta-backendissä, jolloin tätä ei tarvita
      filterTree(data?.organisaatioHierarkia?.organisaatiot, org =>
        defaultFilter(org)
      ),
    [data]
  );

  const oppilaitokset = data?.oppilaitokset;
  return { hierarkia, oppilaitokset, ...rest };
};
