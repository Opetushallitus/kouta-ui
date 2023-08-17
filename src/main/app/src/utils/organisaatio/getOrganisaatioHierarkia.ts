import _ from 'lodash';
import queryString from 'query-string';

const getOrganisaatioHierarkia = async ({
  searchString,
  oid,
  oids,
  aktiiviset = true,
  suunnitellut = true,
  lakkautetut = true,
  skipParents = false,
  apiUrls,
  httpClient,
}) => {
  const params = {
    ...(oid ? { oid } : {}),
    ...(searchString ? { searchStr: searchString } : {}),
    aktiiviset: aktiiviset ? 'true' : 'false',
    suunnitellut: suunnitellut ? 'true' : 'false',
    lakkautetut: lakkautetut ? 'true' : 'false',
    skipParents: skipParents ? 'true' : 'false',
    ...(_.isArray(oids) && { oidRestrictionList: oids }),
  };

  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.organisaatio-hierarkia'),
    {
      params,
      paramsSerializer: queryString.stringify,
    }
  );

  return _.get(data, 'organisaatiot') || [];
};

export default getOrganisaatioHierarkia;
