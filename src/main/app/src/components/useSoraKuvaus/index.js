import { getKoutaSoraKuvausById } from '../../apiUtils';
import useApiAsync from '../useApiAsync';

const noopPromiseFn = () => Promise.resolve(null);

export const useSoraKuvaus = id => {
  const { data: soraKuvaus, ...rest } = useApiAsync({
    promiseFn: id ? getKoutaSoraKuvausById : noopPromiseFn,
    id,
    watch: id,
  });

  return { soraKuvaus, ...rest };
};

export default useSoraKuvaus;
