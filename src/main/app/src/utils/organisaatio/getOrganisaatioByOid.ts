const getOrganisaatioByOid = async ({ oid, apiUrls, httpClient }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.organisaatio-by-oid', oid)
  );

  return data;
};

export default getOrganisaatioByOid;
