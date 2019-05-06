import { useCallback, useContext } from 'react';
import DataLoader from 'dataloader';

import { memoize } from '../../utils';
import useApiAsync from '../useApiAsync';
import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import { getOrganisaatiotByOids } from '../../apiUtils';

const getOrganisaatioLoader = memoize((httpClient, apiUrls) => {
  return new DataLoader(oids =>
    getOrganisaatiotByOids({ oids, httpClient, apiUrls }).then(
      organisaatiot => {
        return oids.map(
          oid =>
            organisaatiot.find(({ oid: orgOid }) => orgOid === oid) || null,
        );
      },
    ),
  );
});

export const useOrganisaatioLoader = () => {
  const apiUrls = useContext(UrlContext);
  const httpClient = useContext(HttpContext);

  return getOrganisaatioLoader(httpClient, apiUrls);
};

export const useOrganisaatio = oid => {
  const organisaatioLoader = useOrganisaatioLoader();

  const promiseFn = useCallback(
    ({ oid }) => {
      return organisaatioLoader.load(oid);
    },
    [organisaatioLoader],
  );

  const { data: organisaatio, ...rest } = useApiAsync({
    promiseFn,
    oid,
    watch: oid,
  });

  return { ...rest, organisaatio };
};

export const useOrganisaatiot = oids => {
  const organisaatioLoader = useOrganisaatioLoader();

  const promiseFn = useCallback(
    ({ oids }) => {
      return organisaatioLoader.loadMany(oids);
    },
    [organisaatioLoader],
  );

  const { data: organisaatiot, ...rest } = useApiAsync({
    promiseFn,
    oids,
    watch: JSON.stringify(oids),
  });

  return { ...rest, organisaatiot };
};

export default useOrganisaatio;
