import { getKoutaSoraKuvaukset } from '../../apiUtils';
import useApiAsync from '../useApiAsync';

export const useSoraKuvaukset = () => {
  const { data: soraKuvaukset, ...rest } = useApiAsync({
    promiseFn: getKoutaSoraKuvaukset,
  });

  return { soraKuvaukset, ...rest };
};

export default useSoraKuvaukset;
