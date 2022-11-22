import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus from '#/src/utils/organisaatio/getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus';

export const useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus = () => {
  console.log('CALLING USE OPPILAITOKSET');
  const { data: organisaatiot, ...rest } = useApiQuery(
    'getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus',
    getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus,
    {},
    { ...LONG_CACHE_QUERY_OPTIONS }
  );

  return { organisaatiot, ...rest };
};

export default useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus;
