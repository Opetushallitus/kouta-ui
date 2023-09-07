import { AxiosInstance } from 'axios';

type GetKoodistoProps = {
  koodistoUri: string;
  httpClient: AxiosInstance;
  apiUrls: any;
  versio?: number;
};

const getKoodisto = async ({
  koodistoUri,
  httpClient,
  apiUrls,
  versio,
}: GetKoodistoProps) => {
  const { data } = await httpClient.get<Array<Koodi>>(
    apiUrls.url('kouta-backend.koodisto.koodit', koodistoUri),
    {
      params: versio ? { versio } : {},
    }
  );

  return data;
};

type GetValintakokeentyyppiKoodistoProps = {
  httpClient: any;
  koulutuskoodit: Array<string>;
  hakutapakoodi: string;
  haunkohdejoukkokoodi: string;
  osaamisalat: Array<string>;
  apiUrls: any;
};

export const getValintakokeentyyppiKoodisto = async ({
  httpClient,
  apiUrls,
  koulutuskoodit,
  hakutapakoodi,
  haunkohdejoukkokoodi,
  osaamisalat,
}: GetValintakokeentyyppiKoodistoProps) => {
  const koulutuskoodiQueryParams = koulutuskoodit
    .map(kk => `koulutuskoodi=${encodeURIComponent(kk)}`)
    .join('&');
  const osaamisalatkoodiQueryParams = osaamisalat
    .map(kk => `osaamisalakoodi=${encodeURIComponent(kk)}`)
    .join('&');
  const koulutuskoodiQuery =
    koulutuskoodit && koulutuskoodit.length > 0
      ? `&${koulutuskoodiQueryParams}`
      : '';
  const osaamisalakoodiQuery =
    osaamisalat && osaamisalat.length > 0
      ? `&${osaamisalatkoodiQueryParams}`
      : '';
  const endpoint = `${apiUrls.url(
    'kouta-backend.koodisto-valintakokeentyypit',
    hakutapakoodi || '',
    haunkohdejoukkokoodi || ''
  )}${koulutuskoodiQuery}${osaamisalakoodiQuery}`;
  const { data } = await httpClient.get(endpoint);
  return data;
};

export default getKoodisto;
