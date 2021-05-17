import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import {
  getSisaltyyYlakoodit,
  GET_SISALTYY_YLAKOODIT_QUERY_KEY,
} from '#/src/utils/koodi/getSisaltyyYlakoodit';
import { selectValidKoulutusKoodit } from '#/src/utils/koodi/selectValidKoulutusKoodit';

export const useKoulutuksetByKoulutusala = koulutusalaKoodiUri => {
  return useApiQuery(
    GET_SISALTYY_YLAKOODIT_QUERY_KEY,
    getSisaltyyYlakoodit,
    { koodiUri: koulutusalaKoodiUri },
    {
      enabled: Boolean(koulutusalaKoodiUri),
      select: selectValidKoulutusKoodit,
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};
