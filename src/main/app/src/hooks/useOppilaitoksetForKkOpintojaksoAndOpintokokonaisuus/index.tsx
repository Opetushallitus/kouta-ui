import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getOppilaitosOrgsForAvoinKorkeakoulutus } from '#/src/utils/organisaatio/getOppilaitosOrgsForAvoinKorkeakoulutus';

export const useOppilaitoksetForAvoinKorkeakoulutus = selectedLanguage => {
  const { data, ...rest } = useApiQuery(
    'getOppilaitoksetForAvoinKorkeakoulutus',
    getOppilaitosOrgsForAvoinKorkeakoulutus,
    {},
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      select: data => _.sortBy(data, [org => org.nimi[selectedLanguage]]),
    }
  );

  return { organisaatiot: data, ...rest };
};

export default useOppilaitoksetForAvoinKorkeakoulutus;
