import getSoraKuvausById from '#/src/utils/soraKuvaus/getSoraKuvausById';
import useApiAsync from '#/src/hooks/useApiAsync';

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
