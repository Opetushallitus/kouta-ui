import getSoraKuvaukset from '../../utils/kouta/getSoraKuvaukset';
import useApiAsync from '../useApiAsync';

export const useSoraKuvaukset = () => {
  const { data: soraKuvaukset, ...rest } = useApiAsync({
    promiseFn: getSoraKuvaukset,
  });

  return { soraKuvaukset, ...rest };
};

export default useSoraKuvaukset;
