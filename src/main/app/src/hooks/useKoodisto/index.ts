import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getKoodisto, {
  getValintakokeentyyppiKoodisto,
} from '#/src/utils/koodi/getKoodisto';

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

type UseValintakokeentyyppiKoodistoProps = {
  koulutuskoodit: Array<string>;
  hakutapa: string;
  haunkohdejoukko: string;
  osaamisalat: Array<string>;
};

export const useValintakokeentyyppiKoodisto = ({
  koulutuskoodit,
  hakutapa,
  haunkohdejoukko,
  osaamisalat,
}: UseValintakokeentyyppiKoodistoProps) => {
  return useApiQuery(
    GET_VALINTAKOKEENTYYPPI_KOODISTO_QUERY_KEY,
    getValintakokeentyyppiKoodisto,
    {
      koulutuskoodit,
      hakutapakoodi: hakutapa,
      haunkohdejoukkokoodi: haunkohdejoukko,
      osaamisalat,
    },
    {
      enabled:
        koulutuskoodit.length > 0 &&
        Boolean(hakutapa) &&
        Boolean(haunkohdejoukko),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};

export const GET_KOODISTO_QUERY_KEY = 'getKoodisto';

export const GET_VALINTAKOKEENTYYPPI_KOODISTO_QUERY_KEY =
  'getValintakokeentyyppiKoodisto';

export default useKoodisto;
