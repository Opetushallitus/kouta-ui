import getSoraKuvausById from '../../utils/kouta/getSoraKuvausById';
import useApiAsync from '../useApiAsync';

const noopPromiseFn = () => Promise.resolve(null);

export const useSoraKuvaus = id => {
  const { data: soraKuvaus, ...rest } = useApiAsync({
    promiseFn: id ? getSoraKuvausById : noopPromiseFn,
    id,
    watch: id,
  });

  return { soraKuvaus, ...rest };
};

export default useSoraKuvaus;
