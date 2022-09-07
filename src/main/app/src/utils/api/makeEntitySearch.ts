import qs from 'query-string';

export const makeEntitySearch =
  urlKey =>
  async ({ params, httpClient, apiUrls }) => {
    const { data } = await httpClient.get(apiUrls.url(urlKey), {
      params,
      errorNotifier: {
        silent: true,
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'comma' }),
    });
    return data;
  };

export const makeFilteredEntitySearch =
  (urlKey, filterParams) =>
  async ({ params, httpClient, apiUrls }) => {
    if (filterParams.hakuOid) {
      params.hakuOid = filterParams.hakuOid;
    }
    if (filterParams.toteutusOid) {
      params.toteutusOid = filterParams.toteutusOid;
    }
    const { data } = await httpClient.get(apiUrls.url(urlKey), {
      params,
      errorNotifier: {
        silent: true,
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'comma' }),
    });
    return data;
  };
