const getOrganisaatiotByOids = async ({ oids, httpClient, apiUrls }) => {
  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.organisaatiot-by-oids'),
    oids
  );

  return data;
};

export default getOrganisaatiotByOids;
