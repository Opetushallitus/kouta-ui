import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useKoodistoVersiot } from '#/src/contexts/KoodistoversiotContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getKoodisto from '#/src/utils/koodi/getKoodisto';

export const useKoodisto = ({ koodisto, versio: versioProp }) => {
  const versiot = useKoodistoVersiot();

  const contextVersio = _.isObject(versiot) ? versiot[koodisto] : '';
  const versio = versioProp || contextVersio || '';

  return useApiQuery(
    'getKoodisto',
    getKoodisto,
    {
      koodistoUri: koodisto,
      versio,
    },
    {
      enabled: Boolean(koodisto),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};

export default useKoodisto;
