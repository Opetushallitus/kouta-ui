import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus from '#/src/utils/organisaatio/getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus';

export const useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus =
  selectedLanguage => {
    const { data, ...rest } = useApiQuery(
      'getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus',
      getOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus,
      {},
      { ...LONG_CACHE_QUERY_OPTIONS }
    );

    const sortedOrganisaatiot = _.sortBy(data, [
      org => org.nimi[selectedLanguage],
    ]);
    return { organisaatiot: sortedOrganisaatiot, ...rest };
  };

export default useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus;
