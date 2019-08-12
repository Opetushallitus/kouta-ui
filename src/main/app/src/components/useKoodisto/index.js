import { useContext } from 'react';

import useApiAsync from '../useApiAsync';
import { isObject } from '../../utils';
import KoodistoversiotContext from '../KoodistoversiotContext';
import { getKoodisto } from '../../apiUtils';

const noopPromiseFn = () => Promise.resolve();

export const useKoodisto = ({ koodisto, versio: versioProp }) => {
  const versiot = useContext(KoodistoversiotContext);

  const contextVersio = isObject(versiot) ? versiot[koodisto] : '';
  const versio = versioProp || contextVersio || '';

  const watch = JSON.stringify([koodisto, versio]);

  const promiseFn = koodisto ? getKoodisto : noopPromiseFn;

  return useApiAsync({
    promiseFn,
    koodistoUri: koodisto,
    koodistoVersio: versio,
    watch,
  });
};

export default useKoodisto;
