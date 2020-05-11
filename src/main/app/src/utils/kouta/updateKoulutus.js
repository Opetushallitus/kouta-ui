import produce from 'immer';

const updateKoulutus = async ({ koulutus, httpClient, apiUrls }) => {
  const { lastModified = '', ...rest } = koulutus;

  const headers = {
    'X-If-Unmodified-Since': lastModified,
  };

  const update = produce(rest, draft => {
    draft.metadata.tyyppi = koulutus.koulutustyyppi;
  });

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.koulutus'),
    update,
    { headers }
  );

  return data;
};

export default updateKoulutus;
