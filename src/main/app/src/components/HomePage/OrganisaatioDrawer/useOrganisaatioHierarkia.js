import { useMemo } from 'react';

import { isString, isArray } from '../../../utils';
import { getOrganisaatioHierarkia } from '../../../apiUtils';
import useApiAsync from '../../useApiAsync';
import useAuthorizedUser from '../../useAuthorizedUser';
import userHasOrganisaatioRoles from '../../../utils/userHasOrganisaatioRoles';
import { KOUTA_INDEX_READ_ROLE } from '../../../constants';

const hasRequiredRoles = (user, organisaatioOid) => {
  return userHasOrganisaatioRoles(user, organisaatioOid, [
    KOUTA_INDEX_READ_ROLE,
  ]);
};

const filterHierarkiaByUser = (hierarkia, user) => {
  return hierarkia.flatMap(org => [
    ...(hasRequiredRoles(user, org.oid)
      ? [org]
      : filterHierarkiaByUser(org.children, user)),
  ]);
};

const useOrganisaatioHierarkia = ({ name }) => {
  const user = useAuthorizedUser();

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

  const hierarkia = useMemo(() => {
    return isArray(data) && user ? filterHierarkiaByUser(data, user) : [];
  }, [data, user]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
