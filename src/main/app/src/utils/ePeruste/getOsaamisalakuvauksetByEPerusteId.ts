import _ from 'lodash';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { EPERUSTE_SERVICE_QUERY_OPTIONS } from '#/src/constants';

export const getOsaamisalakuvauksetByEPerusteId = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  if (!_.isNil(ePerusteId)) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.osaamisalakuvaukset', ePerusteId)
    );

    return data?.reformi ?? {};
  }
};

export const useEPerusteOsaamisalaKuvaukset = props =>
  useApiQuery(
    'getOsaamisalakuvauksetByEPerusteId',
    props,
    getOsaamisalakuvauksetByEPerusteId,
    EPERUSTE_SERVICE_QUERY_OPTIONS
  );
