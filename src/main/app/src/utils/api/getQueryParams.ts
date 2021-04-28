import { JULKAISUTILA } from '#/src/constants';

export const FILTER_PAGE_SIZE = 10;

export const getQueryParams = ({
  organisaatioOid,
  nimi = '',
  language = 'fi',
  pageSize = FILTER_PAGE_SIZE,
  showArchived = false,
  page = 1,
  orderField,
  orderDirection,
  tila,
}) => {
  const params = {
    ...(nimi && { nimi }),
    ...(orderField && { 'order-by': orderField }),
    ...(orderDirection && { order: orderDirection }),
    ...(tila && { tila }),
    organisaatioOid,
    lng: language,
    size: pageSize,
    arkistoidut: showArchived || tila === JULKAISUTILA.ARKISTOITU,
    page,
  };

  return params;
};

export default getQueryParams;
