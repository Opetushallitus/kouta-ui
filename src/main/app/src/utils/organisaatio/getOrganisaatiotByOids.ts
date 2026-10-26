import { HttpClient } from '#/src/httpClient';
import { OrganisaatioModel } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

type GetOrganisaatiotByOidsProps = {
  oids: Array<string>;
  httpClient: HttpClient;
  apiUrls: ApiUrls;
};

const getOrganisaatiotByOids = async ({
  oids,
  httpClient,
  apiUrls,
}: GetOrganisaatiotByOidsProps): Promise<Array<OrganisaatioModel>> => {
  const { data } = await httpClient.post<Array<OrganisaatioModel>>(
    apiUrls.url('kouta-backend.organisaatiot-by-oids'),
    oids
  );

  return data;
};

export default getOrganisaatiotByOids;
