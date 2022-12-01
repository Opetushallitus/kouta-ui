import { LONG_CACHE_QUERY_OPTIONS, ORGANISAATIOTYYPPI } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getOppilaitosOrgsForAvoinKorkeakoulutus } from '#/src/utils/organisaatio/getOppilaitosOrgsForAvoinKorkeakoulutus';
import { flatFilterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

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
      select: data =>
        flatFilterHierarkia(
          data,
          organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)
        ),
    }
  );

  return { organisaatiot: data, ...rest };
};
