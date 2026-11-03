import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import {
  getSisaltyyYlakoodit,
  GET_SISALTYY_YLAKOODIT_QUERY_KEY,
} from '#/src/utils/koodi/getSisaltyyYlakoodit';
import { selectValidKoulutusKoodit } from '#/src/utils/koodi/selectValidKoulutusKoodit';

export const useKoulutuksetByTutkintotyyppi = tutkintotyyppiKoodiUri => {
  return useApiQuery(
    GET_SISALTYY_YLAKOODIT_QUERY_KEY,
    getSisaltyyYlakoodit,
    { koodiUri: tutkintotyyppiKoodiUri },
    {
      enabled: Boolean(tutkintotyyppiKoodiUri),
      select: data => selectValidKoulutusKoodit({ data }),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};
