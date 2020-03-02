import queryString from 'query-string';
import { get, isArray } from 'lodash';

const getOrganisaatioHierarkia = async ({
  searchString = '',
  aktiiviset = true,
  suunnitellut = true,
  lakkautetut = false,
  oids,
  apiUrls,
  httpClient,
}) => {
  const params = {
    searchStr: searchString,
    aktiiviset: aktiiviset ? 'true' : 'false',
    suunnitellut: suunnitellut ? 'true' : 'false',
    lakkautetut: lakkautetut ? 'true' : 'false',
    ...(isArray(oids) && { oidResctrictionList: oids }),
  };

  const { data } = await httpClient.get(
    apiUrls.url('organisaatio-service.hierarkia-haku'),
    {
      params,
      paramsSerializer: queryString.stringify,
    },
  );

  return get(data, 'organisaatiot') || [];
};

export default getOrganisaatioHierarkia;
