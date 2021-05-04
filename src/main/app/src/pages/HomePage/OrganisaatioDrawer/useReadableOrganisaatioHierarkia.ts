import { useMemo, useCallback } from 'react';

import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import getUserRoles from '#/src/utils/getUserRoles';
import isOid from '#/src/utils/isOid';
import getOrganisaatioHierarkia from '#/src/utils/organisaatio/getOrganisaatioHierarkia';
import {
  filterByName,
  flatFilterHierarkia,
} from '#/src/utils/organisaatio/hierarkiaHelpers';

import { createCanReadSomethingRoleBuilder } from '../utils';

const pickKoutaRoleOid = role => {
  if (role?.startsWith('APP_KOUTA')) {
    const oidStr = role.slice(role.lastIndexOf('_') + 1);

    return isOid(oidStr) ? oidStr : undefined;
  }
};

const getKoutaRolesOrganisaatioOids = roles => {
  return _.uniq(roles.map(pickKoutaRoleOid).filter(Boolean));
};

const isValidNameSearch = name => _.isString(name) && name.length >= 3;

const invalidOrganisaatioTypeMap = {
  organisaatiotyyppi_05: true,
  organisaatiotyyppi_06: true,
  organisaatiotyyppi_07: true,
  organisaatiotyyppi_08: true,
};

const organisaatioHasCorrectType = organisaatio => {
  const { organisaatiotyypit } = organisaatio;

  if (!_.isArray(organisaatiotyypit)) {
    return true;
  }

  return !organisaatiotyypit.find(t => Boolean(invalidOrganisaatioTypeMap[t]));
};

export const useReadableOrganisaatioHierarkia = ({
  name,
  nameSearchEnabled = true,
}) => {
  const roleBuilder = useAuthorizedUserRoleBuilder();
  const language = useUserLanguage();
  const user = useAuthorizedUser();
  const roles = useMemo(() => getUserRoles(user), [user]);
  const oids = useMemo(() => getKoutaRolesOrganisaatioOids(roles), [roles]);

  const promiseFn = useMemo(() => {
    if (nameSearchEnabled && !isValidNameSearch(name)) {
      return () => Promise.resolve([]);
    }

    return getOrganisaatioHierarkia;
  }, [name, nameSearchEnabled]);

  const formattedName = useMemo(
    () => (_.isString(name) ? name.toLowerCase() : undefined),
    [name]
  );

  const { data, ...rest } = useApiQuery(
    'searchOrganisaatioHierarkia',
    promiseFn,
    {
      searchString: formattedName,
      oids,
    },
    { ...LONG_CACHE_QUERY_OPTIONS }
  );

  const hasRequiredRoles = useCallback(
    organisaatio => {
      return createCanReadSomethingRoleBuilder(
        roleBuilder,
        organisaatio
      ).result();
    },
    [roleBuilder]
  );

  const roleHierarkia = useMemo(() => {
    return _.isArray(data)
      ? flatFilterHierarkia(
          data,
          org => organisaatioHasCorrectType(org) && hasRequiredRoles(org)
        )
      : [];
  }, [data, hasRequiredRoles]);

  const hierarkia = useMemo(() => {
    return nameSearchEnabled
      ? filterByName(roleHierarkia, formattedName, language)
      : roleHierarkia;
  }, [roleHierarkia, formattedName, language, nameSearchEnabled]);

  return { hierarkia, ...rest };
};
