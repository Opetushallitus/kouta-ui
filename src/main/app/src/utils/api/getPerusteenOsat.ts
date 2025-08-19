import { AxiosInstance } from 'axios';
import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

type tutkinnonOsa = {
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
  apiUrls: any;
  tutkinnonOsat: Array<tutkinnonOsa>;
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

type PerusteenOsaProps = {
  tutkinnonOsat: Array<tutkinnonOsa>;
};

export const usePerusteenOsat = (props: PerusteenOsaProps) => {
  return useApiQuery(
    'getPerusteenOsat',
    getPerusteenOsat,
    props,
    LONG_CACHE_QUERY_OPTIONS
  );
};
