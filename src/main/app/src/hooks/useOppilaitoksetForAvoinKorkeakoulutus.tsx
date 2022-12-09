import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getOppilaitosOrgsForAvoinKorkeakoulutus } from '#/src/utils/organisaatio/getOppilaitosOrgsForAvoinKorkeakoulutus';

export const useOppilaitoksetForAvoinKorkeakoulutus = (
  { enabled }: any = { enabled: true }
) => {
  const { data, ...rest } = useApiQuery(
    'getOppilaitoksetForAvoinKorkeakoulutus',
    getOppilaitosOrgsForAvoinKorkeakoulutus,
    {},
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      enabled,
    }
  );

  return { organisaatiot: data, ...rest };
};
