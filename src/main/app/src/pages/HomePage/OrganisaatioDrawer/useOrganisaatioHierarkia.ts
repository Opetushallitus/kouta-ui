import { useMemo, useCallback } from 'react';
import { isString, isArray, uniq } from 'lodash';
import getOrganisaatioHierarkia from '#/src/utils/organisaatio/getOrganisaatioHierarkia';
import useApiAsync from '#/src/hooks/useApiAsync';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { createCanReadSomethingRoleBuilder } from '../utils';
import useAuthorizedUser from '#/src/hooks/useAuthorizedUser';
import getUserRoles from '#/src/utils/getUserRoles';
import getRoleOrganisaatioOid from '#/src/utils/getRoleOrganisaatioOid';
import useLanguage from '#/src/hooks/useLanguage';
import {
  filterByName,
  flatFilterHierarkia,
} from '#/src/utils/organisaatio/hierarkiaHelpers';

const getRolesOrganisaatioOids = roles => {
  return uniq(roles.map(getRoleOrganisaatioOid).filter(Boolean));
};

const isValidNameSearch = name => isString(name) && name.length >= 3;

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

const useOrganisaatioHierarkia = ({
  name,
  nameSearchEnabled = true,
  languageFilterEnabled = true,
}) => {
  const roleBuilder = useAuthorizedUserRoleBuilder();
  const language = useLanguage();
  const user = useAuthorizedUser();
  const roles = useMemo(() => getUserRoles(user), [user]);
  const oids = useMemo(() => getRolesOrganisaatioOids(roles), [roles]);

  const promiseFn = useMemo(() => {
    if (nameSearchEnabled && !isValidNameSearch(name)) {
      return () => Promise.resolve([]);
    }

    return getOrganisaatioHierarkia;
  }, [name, nameSearchEnabled]);

  const watch = JSON.stringify([name, oids]);
  const formattedName = isString(name) ? name.toLowerCase() : undefined;

  const { data, ...rest } = useApiAsync({
    promiseFn,
    searchString: formattedName,
    oids,
    watch,
  });

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
    return isArray(data)
      ? flatFilterHierarkia(
          data,
          org => hasRequiredRoles(org) && organisaatioHasCorrectType(org)
        )
      : [];
  }, [data, hasRequiredRoles]);

  const hierarkia = useMemo(() => {
    return languageFilterEnabled
      ? filterByName(roleHierarkia, formattedName, language)
      : roleHierarkia;
  }, [roleHierarkia, formattedName, language, languageFilterEnabled]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
