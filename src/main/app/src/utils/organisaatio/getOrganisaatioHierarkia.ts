import _ from 'lodash';
import queryString from 'query-string';

const getOrganisaatioHierarkia = async ({
  searchString,
  oids,
  aktiiviset = true,
  suunnitellut = true,
  lakkautetut = false,
  apiUrls,
  httpClient,
}) => {
  const params = {
    ...(searchString ? { searchStr: searchString } : {}),
    aktiiviset: aktiiviset ? 'true' : 'false',
    suunnitellut: suunnitellut ? 'true' : 'false',
    lakkautetut: lakkautetut ? 'true' : 'false',
    ...(_.isArray(oids) && { oidResctrictionList: oids }),
  };

  const { data } = await httpClient.get(
    apiUrls.url('organisaatio-service.hierarkia-haku'),
    {
      params,
      paramsSerializer: queryString.stringify,
    }
  );

  return _.get(data, 'organisaatiot') || [];
};

export default getOrganisaatioHierarkia;
