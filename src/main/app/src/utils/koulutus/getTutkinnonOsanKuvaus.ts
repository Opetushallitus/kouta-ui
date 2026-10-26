import { isNil } from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getTutkinnonOsanKuvaus = async ({
  httpClient,
  apiUrls,
  tutkinnonOsat,
}) => {
  if (isNil(tutkinnonOsat)) {
    return null;
  }

  const kuvaukset = await Promise.all(
    tutkinnonOsat.map(id =>
      httpClient
        .get(apiUrls.url('eperusteet-service.tutkinnonosankuvaukset', id))
        .then(({ data }) => data)
    )
  );
  return kuvaukset;
};

export const useTutkinnonOsienKuvaukset = props => {
  return useApiQuery(
    'getTutkinnonOsienKuvaukset',
    getTutkinnonOsanKuvaus,
    props,
    LONG_CACHE_QUERY_OPTIONS
  );
};
