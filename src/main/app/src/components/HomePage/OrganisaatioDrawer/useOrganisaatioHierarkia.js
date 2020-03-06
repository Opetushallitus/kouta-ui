import { useMemo, useCallback } from 'react';
import { get, isString, isArray, uniq } from 'lodash';
import getOrganisaatioHierarkia from '../../../utils/organisaatioService/getOrganisaatioHierarkia';
import useApiAsync from '../../useApiAsync';
import useAuthorizedUserRoleBuilder from '../../useAuthorizedUserRoleBuilder';
import { createCanReadSomethingRoleBuilder } from '../utils';
import useAuthorizedUser from '../../useAuthorizedUser';
import getUserRoles from '../../../utils/getUserRoles';
import getRoleOrganisaatioOid from '../../../utils/getRoleOrganisaatioOid';
import useLanguage from '../../useLanguage';
import { getFirstLanguageValue } from '../../../utils';

const filterHierarkia = (hierarkia, filterFn) => {
  return hierarkia.flatMap(org => [
    ...(filterFn(org) ? [org] : filterHierarkia(org.children || [], filterFn)),
  ]);
};

const filterByName = (hierarkia, name, language) => {
  return hierarkia.flatMap(org => {
    const orgName = getFirstLanguageValue(get(org, 'nimi'), language);

    const isMatch = isString(orgName)
      ? orgName.toLowerCase().indexOf(name) >= 0
      : false;

    const matchingChildren = filterByName(org.children || [], name, language);

    if (isMatch || matchingChildren.length > 0) {
      return [org];
    }

    return [];
  });
};

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
        organisaatio,
      ).result();
    },
    [roleBuilder],
  );

  const roleHierarkia = useMemo(() => {
    return isArray(data)
      ? filterHierarkia(
          data,
          org => hasRequiredRoles(org) && organisaatioHasCorrectType(org),
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
