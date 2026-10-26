import { isBoolean, isEmpty, isNumber, pickBy } from 'lodash-es';

export const FILTER_PAGE_SIZE = 10;

const isValidQueryStringValue = x => isNumber(x) || !isEmpty(x) || isBoolean(x);

const joinIfArray = (value: Array<string> | string | null | undefined) =>
  Array.isArray(value) ? value.join(',') : (value ?? '');

type SearchQueryParams = {
  organisaatioOid?: string;
  nimi?: string;
  hakuNimi?: string;
  language?: LanguageCode;
  pageSize?: number;
  page?: number;
  orderField?: string;
  orderDirection?: string;
  tila?: Array<string> | string | null;
  koulutustyyppi?: Array<string> | string | null;
  hakutapa?: Array<string> | string | null;
  julkinen?: boolean | null;
  koulutuksenAlkamiskausi?: Array<string> | string | null;
  koulutuksenAlkamisvuosi?: Array<string> | string | null;
  orgWhitelist?: Array<string> | string | null;
};

export const getSearchQueryParams = ({
  organisaatioOid,
  nimi = '',
  hakuNimi = '',
  language = 'fi',
  pageSize = FILTER_PAGE_SIZE,
  page = 1,
  orderField,
  orderDirection,
  tila,
  koulutustyyppi,
  hakutapa,
  julkinen,
  koulutuksenAlkamiskausi,
  koulutuksenAlkamisvuosi,
  orgWhitelist,
}: SearchQueryParams) =>
  pickBy(
    {
      nimi,
      hakuNimi,
      'order-by': orderField || 'nimi',
      order: orderDirection || 'asc',
      tila: joinIfArray(tila),
      organisaatioOid,
      lng: language,
      size: pageSize,
      page,
      koulutustyyppi,
      hakutapa,
      julkinen: julkinen,
      koulutuksenAlkamiskausi: koulutuksenAlkamiskausi,
      koulutuksenAlkamisvuosi: joinIfArray(koulutuksenAlkamisvuosi),
      orgWhitelist,
    },
    isValidQueryStringValue
  );
