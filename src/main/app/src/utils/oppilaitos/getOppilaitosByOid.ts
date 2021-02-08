import _ from 'lodash';

const getOppilaitosByOid = async ({
  oid,
  httpClient,
  apiUrls,
  silent = false,
}) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.oppilaitos-by-oid', oid),
    {
      errorNotifier: {
        silent,
      },
    }
  );

  const lastModified = _.get(headers, 'x-last-modified') || null;

  return _.isObject(data) ? { lastModified, ...data } : data;
};

export default getOppilaitosByOid;
