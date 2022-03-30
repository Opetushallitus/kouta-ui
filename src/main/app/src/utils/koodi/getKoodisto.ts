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
  const koodistoVersio = versio;
  const { data } = await httpClient.get(
    apiUrls.url('koodisto-service.koodi', koodistoUri),
    {
      params: {
        ...(koodistoVersio
          ? // Jos annetaan koodiston versio, täytyy noutaa myös koodit, jotka eivät ole voimassa, koska vanhempi versio ei yleensä ole enää voimassa.
            { koodistoVersio, onlyValidKoodis: false }
          : { onlyValidKoodis: true }),
      },
    }
  );

  return data;
};

export default getKoodisto;
