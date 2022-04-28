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
  const { data } = await httpClient.get(
    versio
      ? apiUrls.url('koodisto-service.codeelement', koodi, versio)
      : apiUrls.url('koodisto-service.codeelement', 'latest', koodi),
    {
      errorNotifier: {
        silent,
      },
    }
  );

  return data;
};

export default getKoodi;
