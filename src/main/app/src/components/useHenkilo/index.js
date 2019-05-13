import useApiAsync from '../useApiAsync';
import { getOppijanumerorekisteriHenkilo } from '../../apiUtils';

export const useHenkilo = oid => {
  const { data: henkilo, ...rest } = useApiAsync({
    promiseFn: getOppijanumerorekisteriHenkilo,
    oid,
    watch: oid,
  });

  return { henkilo, ...rest };
};

export default useHenkilo;
