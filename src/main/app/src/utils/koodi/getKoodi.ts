import { KOODISTO_VERSIOT } from '#/src/constants';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

type GetKoodiProps = {
  apiUrls: any;
  httpClient: any;
  koodi: string;
  versio?: number;
  silent?: boolean;
};

export const getKoodi = async ({
  apiUrls,
  httpClient,
  koodi,
  versio,
  silent = false,
}: GetKoodiProps) => {
  const { koodisto } = parseKoodiUri(koodi);
  const { data } = await httpClient.get(
    apiUrls.url(
      'koodisto-service.codeelement',
      koodi,
      versio ?? KOODISTO_VERSIOT[koodisto] ?? ''
    ),
    {
      errorNotifier: {
        silent,
      },
    }
  );

  return data;
};

export default getKoodi;
