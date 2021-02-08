import { useContext } from 'react';

import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import KoodistoversiotContext from '#/src/contexts/KoodistoversiotContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getKoodisto from '#/src/utils/koodi/getKoodisto';

export const useKoodisto = ({ koodisto, versio: versioProp }) => {
  const versiot = useContext(KoodistoversiotContext);

  const contextVersio = _.isObject(versiot) ? versiot[koodisto] : '';
  const versio = versioProp || contextVersio || '';

  return useApiQuery(
    'getKoodisto',
    {
      koodistoUri: koodisto,
      versio,
    },
    getKoodisto,
    {
      enabled: Boolean(koodisto),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};

export default useKoodisto;
