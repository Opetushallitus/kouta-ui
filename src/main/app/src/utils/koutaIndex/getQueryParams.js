const getQueryParams = ({
  organisaatioOid: organisaatioOidArg = [],
  nimi = '',
  language = 'fi',
  pageSize = 10,
  showArchived = false,
  page = 1,
  orderField,
  orderDirection,
  tila,
}) => {
  const organisaatio = organisaatioOidArg.join(',');

  const params = {
    ...(nimi && { nimi }),
    ...(orderField && { 'order-by': orderField }),
    ...(orderDirection && { order: orderDirection }),
    ...(tila && { tila }),
    organisaatio,
    language,
    size: pageSize,
    arkistoidut: showArchived,
    page,
  };

  return params;
};

export default getQueryParams;
