import { AxiosInstance } from 'axios';
import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { ApiUrls } from '#/src/urls';

type TutkinnonOsa = {
  ePerusteId: string;
  koulutusKoodiUri: string;
  tutkinnonosaId: string;
  tutkinnonosaViite: string;
};

export const getPerusteenOsat = async ({
  httpClient,
  apiUrls,
  tutkinnonOsat,
}: {
  httpClient: AxiosInstance;
  apiUrls: ApiUrls;
  tutkinnonOsat: Array<TutkinnonOsa>;
}) => {
  return _.isEmpty(tutkinnonOsat)
    ? null
    : await Promise.all(
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
};

export const usePerusteenOsat = (tutkinnonOsat: Array<TutkinnonOsa>) => {
  return useApiQuery(
    'getPerusteenOsat',
    getPerusteenOsat,
    { tutkinnonOsat },
    LONG_CACHE_QUERY_OPTIONS
  );
};
