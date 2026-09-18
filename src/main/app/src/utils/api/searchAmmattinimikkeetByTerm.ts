import { HttpClient } from '#/src/httpClient';
import { ApiUrls } from '#/src/urls';

type GetAmmattinimikkeetByTermProps = {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  term: string;
  limit?: number;
  language?: LanguageCode;
};

const searchAmmattinimikkeetByTerm = async ({
  httpClient,
  apiUrls,
  term,
  limit = 15,
  language = 'fi',
}: GetAmmattinimikkeetByTermProps): Promise<Array<string>> => {
  const { data } = await httpClient.get<Array<string>>(
    apiUrls.url('kouta-backend.ammattinimike-search', term),
    { params: { limit, kieli: language } }
  );

  return data;
};

export default searchAmmattinimikkeetByTerm;
