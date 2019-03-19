import { useContext } from 'react';

import useApiAsync from '../useApiAsync';
import { isObject } from '../../utils';
import KoodistoversiotContext from '../KoodistoversiotContext';
import { getKoodisto } from '../../apiUtils';

export const useKoodisto = ({ koodisto, versio: versioProp }) => {
  const versiot = useContext(KoodistoversiotContext);

  const contextVersio = isObject(versiot) ? versiot[koodisto] : '';
  const versio = versioProp || contextVersio || '';

  const watch = JSON.stringify([koodisto, versio]);

  return useApiAsync({
    promiseFn: getKoodisto,
    koodistoUri: koodisto,
    koodistoVersio: versio,
    watch,
  });
};

export default useKoodisto;
