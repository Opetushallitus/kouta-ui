const getOrganisaatioByOid = async ({ oid, apiUrls, httpClient }) => {
  const { data } = await httpClient.get(
    apiUrls.url('organisaatio-service.organisaatio-by-oid', oid)
  );

  return data;
};

export default getOrganisaatioByOid;
