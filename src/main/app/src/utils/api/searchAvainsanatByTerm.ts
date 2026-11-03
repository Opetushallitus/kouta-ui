import { HttpClient } from '#/src/httpClient';
import { ApiUrls } from '#/src/urls';

type GetAvainsanatByTermProps = {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  term: string;
  limit?: number;
  language?: LanguageCode;
};

const searchAvainsanatByTerm = async ({
  httpClient,
  apiUrls,
  term,
  limit = 15,
  language = 'fi',
}: GetAvainsanatByTermProps): Promise<Array<string>> => {
  const { data } = await httpClient.get<Array<string>>(
    apiUrls.url('kouta-backend.asiasana-search', term),
    { params: { limit, kieli: language } }
  );

  return data;
};

export default searchAvainsanatByTerm;
