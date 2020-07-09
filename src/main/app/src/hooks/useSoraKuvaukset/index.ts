import getSoraKuvaukset from '#/src/utils/soraKuvaus/getSoraKuvaukset';
import useApiAsync from '#/src/hooks/useApiAsync';

export const useSoraKuvaukset = ({ organisaatioOid }) => {
  const { data: soraKuvaukset, ...rest } = useApiAsync({
    promiseFn: getSoraKuvaukset,
    organisaatioOid,
    watch: organisaatioOid,
  });

  return { soraKuvaukset, ...rest };
};

export default useSoraKuvaukset;
