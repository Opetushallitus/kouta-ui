import { useMemo, useCallback } from 'react';

import { isString, isArray } from '../../../utils';
import { getOrganisaatioHierarkia } from '../../../apiUtils';
import useApiAsync from '../../useApiAsync';
import useAuthorizedUserRoleBuilder from '../../useAuthorizedUserRoleBuilder';

import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  VALINTAPERUSTE_ROLE,
} from '../../../constants';

const filterHierarkia = (hierarkia, filterFn) => {
  return hierarkia.flatMap(org => [
    ...(filterFn(org) ? [org] : filterHierarkia(org.children, filterFn)),
  ]);
};

const useOrganisaatioHierarkia = ({ name }) => {
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const promiseFn = useMemo(() => {
    if (!isString(name) || name.length < 3) {
      return () => Promise.resolve([]);
    }

    return getOrganisaatioHierarkia;
  }, [name]);

  const { data, ...rest } = useApiAsync({
    promiseFn,
    searchString: name,
    watch: name,
  });

  const hasRequiredRoles = useCallback(
    organisaatio => {
      return roleBuilder
        .hasReadOneOf(
          [KOULUTUS_ROLE, TOTEUTUS_ROLE, HAKU_ROLE, VALINTAPERUSTE_ROLE],
          organisaatio,
        )
        .result();
    },
    [roleBuilder],
  );

  const hierarkia = useMemo(() => {
    return isArray(data) ? filterHierarkia(data, hasRequiredRoles) : [];
  }, [data, hasRequiredRoles]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
