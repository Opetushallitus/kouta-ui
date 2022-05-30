import { PREVENT_REFETCH_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

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
  const { data } = useApiQuery(
    'getOppilaitoksetByOids',
    getOppilaitoksetByOids,
    { tarjoajaOids },
    { PREVENT_REFETCH_QUERY_OPTIONS }
  );

  return data;
};
