import _fp from 'lodash/fp';

export const FILTER_PAGE_SIZE = 10;

const isValidQueryStringValue = x =>
  _fp.isNumber(x) || !_fp.isEmpty(x) || _fp.isBoolean(x);

export const getSearchQueryParams = ({
  organisaatioOid,
  nimi = '',
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
  orgWhitelist
}) =>
  _fp.pickBy(isValidQueryStringValue, {
    nimi,
    'order-by': orderField,
    order: orderDirection,
    tila: _fp.join(',', tila),
    organisaatioOid,
    lng: language,
    size: pageSize,
    page,
    koulutustyyppi,
    hakutapa,
    julkinen: julkinen,
    koulutuksenAlkamiskausi: koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi: _fp.join(',', koulutuksenAlkamisvuosi),
    orgWhitelist
  });
