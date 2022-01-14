import _fp from 'lodash/fp';

export const FILTER_PAGE_SIZE = 10;

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
}) =>
  _fp.pickBy(x => !_fp.isEmpty(x), {
    nimi,
    'order-by': orderField,
    order: orderDirection,
    tila: _fp.join(',', tila),
    organisaatioOid,
    lng: language,
    size: pageSize,
    page,
    koulutustyyppi,
  });
