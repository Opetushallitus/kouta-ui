const getOrganisaatioHierarkiaByOid = async ({
  oid,
  skipParents = false,
  apiUrls,
  httpClient,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('organisaatio-service.hierarkia', oid) +
      (skipParents ? '&skipParents=true' : '')
  );

  return data?.organisaatiot ?? [];
};

export default getOrganisaatioHierarkiaByOid;
