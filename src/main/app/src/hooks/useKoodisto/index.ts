import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
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
  const versio = versioProp || '';

  return useApiQuery(
    GET_KOODISTO_QUERY_KEY,
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

export const GET_KOODISTO_QUERY_KEY = 'getKoodisto';

export default useKoodisto;
