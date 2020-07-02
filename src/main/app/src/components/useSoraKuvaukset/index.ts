import getSoraKuvaukset from '../../utils/kouta/getSoraKuvaukset';
import useApiAsync from '../useApiAsync';

export const useSoraKuvaukset = ({ organisaatioOid }) => {
  const { data: soraKuvaukset, ...rest } = useApiAsync({
    promiseFn: getSoraKuvaukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  return { soraKuvaukset, ...rest };
};

export default useSoraKuvaukset;
