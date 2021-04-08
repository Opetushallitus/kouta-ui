import { KOODISTO_VERSIOT, LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getKoodisto from '#/src/utils/koodi/getKoodisto';

type UseKoodistoProps = {
  koodisto: string;
  versio?: number;
};

export const useKoodisto = ({
  koodisto,
  versio: versioProp,
}: UseKoodistoProps) => {
  const versio = versioProp || KOODISTO_VERSIOT[koodisto] || '';

  return useApiQuery(
    'getKoodisto',
    getKoodisto,
    {
      koodistoUri: koodisto,
      versio,
    },
    {
      enabled: Boolean(koodisto),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};

export default useKoodisto;
