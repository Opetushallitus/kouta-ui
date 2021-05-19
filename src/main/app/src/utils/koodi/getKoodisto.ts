import { KOODISTO_VERSIOT } from '#/src/constants';

type GetKoodistoProps = {
  koodistoUri: string;
  httpClient: any;
  apiUrls: any;
  versio?: number;
};

const getKoodisto = async ({
  koodistoUri,
  httpClient,
  apiUrls,
  versio,
}: GetKoodistoProps) => {
  const koodistoVersio = versio ?? KOODISTO_VERSIOT[koodistoUri];
  const { data } = await httpClient.get(
    apiUrls.url('koodisto-service.koodi', koodistoUri),
    {
      params: {
        ...(koodistoVersio ? { koodistoVersio } : {}),
      },
    }
  );

  return data;
};

export default getKoodisto;
