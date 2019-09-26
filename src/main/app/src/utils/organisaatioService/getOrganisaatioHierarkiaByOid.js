import get from 'lodash/get';

const getOrganisaatioHierarkiaByOid = async ({
  oid,
  skipParents = false,
  apiUrls,
  httpClient,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('organisaatio-service.hierarkia', oid),
    { params: { skipParents: skipParents ? 'true' : 'false' } },
  );

  return get(data, 'organisaatiot') || [];
};

export default getOrganisaatioHierarkiaByOid;
