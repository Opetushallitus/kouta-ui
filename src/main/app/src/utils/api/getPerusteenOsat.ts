import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getPerusteenOsat = async ({
  httpClient,
  apiUrls,
  tutkinnonOsat,
}) => {
  if (_.isNil(tutkinnonOsat)) {
    return null;
  }

  const perusteenosat = await Promise.all(
    tutkinnonOsat.map(({ ePerusteId, tutkinnonosaId }) => {
      return httpClient
        .get(
          apiUrls.url(
            'eperusteet-service.perusteenosa',
            ePerusteId,
            tutkinnonosaId
          )
        )
        .then(({ data }) => data);
    })
  );
  return perusteenosat;
};

export const usePerusteenOsat = props => {
  return useApiQuery(
    'getPerusteenOsat',
    getPerusteenOsat,
    props,
    LONG_CACHE_QUERY_OPTIONS
  );
};
