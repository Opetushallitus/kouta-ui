import { useMemo, useCallback } from 'react';

import { isString, isArray } from '../../../utils';
import { getOrganisaatioHierarkia } from '../../../apiUtils';
import useApiAsync from '../../useApiAsync';
import useAuthorizedUserRoleBuilder from '../../useAuthorizedUserRoleBuilder';
import { createCanReadSomethingRoleBuilder } from '../utils';

const filterHierarkia = (hierarkia, filterFn) => {
  return hierarkia.flatMap(org => [
    ...(filterFn(org) ? [org] : filterHierarkia(org.children, filterFn)),
  ]);
};

const invalidOrganisaatioTypeMap = {
  organisaatiotyyppi_05: true,
  organisaatiotyyppi_06: true,
  organisaatiotyyppi_07: true,
  organisaatiotyyppi_08: true,
};

const organisaatioHasCorrectType = organisaatio => {
  const { organisaatiotyypit } = organisaatio;

  if (!isArray(organisaatiotyypit)) {
    return true;
  }

  return !organisaatiotyypit.find(t => Boolean(invalidOrganisaatioTypeMap[t]));
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
      return createCanReadSomethingRoleBuilder(
        roleBuilder,
        organisaatio,
      ).result();
    },
    [roleBuilder],
  );

  const hierarkia = useMemo(() => {
    return isArray(data)
      ? filterHierarkia(
          data,
          org => hasRequiredRoles(org) && organisaatioHasCorrectType(org),
        )
      : [];
  }, [data, hasRequiredRoles]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
