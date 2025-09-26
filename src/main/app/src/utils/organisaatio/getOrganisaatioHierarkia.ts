import queryString from 'query-string';

import { HttpClient } from '#/src/httpClient';
import { type OrganisaatioHierarkiaModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

const getOrganisaatioHierarkia = async ({
  searchString,
  oid,
  oids,
  aktiiviset = true,
  suunnitellut = true,
  lakkautetut = false,
  skipParents = false,
  apiUrls,
  httpClient,
}: {
  searchString?: string;
  oid?: string;
  oids?: Array<string>;
  aktiiviset?: boolean;
  suunnitellut?: boolean;
  lakkautetut?: boolean;
  skipParents?: boolean;
  apiUrls: ApiUrls;
  httpClient: HttpClient;
}) => {
  const params = {
    ...(oid ? { oid } : {}),
    ...(searchString ? { searchStr: searchString } : {}),
    aktiiviset: aktiiviset ? 'true' : 'false',
    suunnitellut: suunnitellut ? 'true' : 'false',
    lakkautetut: lakkautetut ? 'true' : 'false',
    skipParents: skipParents ? 'true' : 'false',
    ...(Array.isArray(oids) && { oidRestrictionList: oids }),
  };

  const { data } = await httpClient.get<OrganisaatioHierarkiaModel>(
    apiUrls.url('kouta-backend.organisaatio-hierarkia'),
    {
      params,
      paramsSerializer: params => queryString.stringify(params),
    }
  );

  return data?.organisaatiot ?? [];
};

export default getOrganisaatioHierarkia;
