import { useMemo, useCallback } from 'react';

import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { Organisaatio } from '#/src/types/domainTypes';
import getUserRoles from '#/src/utils/getUserRoles';
import isOid from '#/src/utils/isOid';
import getOrganisaatioHierarkia from '#/src/utils/organisaatio/getOrganisaatioHierarkia';
import {
  filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch,
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

const organisaatioHasCorrectType = (organisaatio: Organisaatio) => {
  const { organisaatiotyyppiUris: organisaatiotyypit } = organisaatio;

  if (!_.isArray(organisaatiotyypit)) {
    return true;
  }

  return !organisaatiotyypit.find(t => Boolean(invalidOrganisaatioTypeMap[t]));
};

//OY-3929 oph-oikeuksisille virkailijoille haetaan organisaatiopuusta valitun organisaation lapsiorganisaatiot,
//muille virkailijoille kaikki joihin on oikeudet
export const useOrgCreateHierarkia = organisaatioOid => {
  const isOph = useIsOphVirkailija();
  const allowedHierarkia = useAllowedOrgs();
  const ophHierarkia = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: true,
  });

  if (isOph) {
    return ophHierarkia;
  } else {
    return allowedHierarkia;
  }
};

export const useAllowedOrgs = () => {
  const roleBuilder = useAuthorizedUserRoleBuilder();
  const user = useAuthorizedUser();
  const roles = useMemo(() => getUserRoles(user), [user]);
  const oids = useMemo(() => getKoutaRolesOrganisaatioOids(roles), [roles]);

  const promiseFn = useMemo(() => {
    return getOrganisaatioHierarkia;
  }, []);

  const { data, ...rest } = useApiQuery(
    'searchOrganisaatioHierarkia',
    promiseFn,
    {
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

  const hierarkia = useMemo(() => {
    return _.isArray(data)
      ? flatFilterHierarkia(
          data,
          org => organisaatioHasCorrectType(org) && hasRequiredRoles(org)
        )
      : [];
  }, [data, hasRequiredRoles]);

  return { hierarkia, ...rest };
};

export const useReadableOrganisaatioHierarkia = ({
  name,
  nameSearchEnabled = true,
}) => {
  const roleBuilder = useAuthorizedUserRoleBuilder();
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

  const hierarkia = useMemo(() => {
    return _.isArray(data)
      ? filterHierarkiaUtilizingChildrenWhenParentDoesNotMatch(
          data,
          org => organisaatioHasCorrectType(org) && hasRequiredRoles(org)
        )
      : [];
  }, [data, hasRequiredRoles]);

  return { hierarkia, ...rest };
};
