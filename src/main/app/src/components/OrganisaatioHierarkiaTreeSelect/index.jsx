import React, { useCallback, useMemo } from 'react';

import useLanguage from '../useLanguage';
import { getFirstLanguageValue } from '../../utils';
import TreeSelect from '../TreeSelect';
import makeLookupObject from '../../utils/makeLookupObject';
import getUserOrganisaatiotWithRoles from '../../utils/getUserOrganisaatiotWithRoles';
import getOrganisaatioParentOidPath from '../../utils/getOrganisaatioParentOidPath';
import { KOUTA_CRUD_ROLE } from '../../constants';

const getValue = ({ oid }) => oid;

const OrganisaatioHierarkiaTreeSelect = ({
  hierarkia,
  disabledOids = [],
  user,
  ...props
}) => {
  const language = useLanguage();

  const getLabel = useCallback(
    ({ nimi }) => getFirstLanguageValue(nimi, language),
    [language],
  );

  const oidLookup = useMemo(
    () =>
      makeLookupObject(getUserOrganisaatiotWithRoles(user, [KOUTA_CRUD_ROLE])),
    [user],
  );

  const getIsDisabled = useCallback(
    organisaatio => {
      const parentOidPath = getOrganisaatioParentOidPath(organisaatio);

      return user && !parentOidPath.find(oid => oidLookup.hasOwnProperty(oid));
    },
    [oidLookup, user],
  );

  return (
    <TreeSelect
      options={hierarkia}
      getLabel={getLabel}
      getValue={getValue}
      getIsDisabled={getIsDisabled}
      {...props}
    />
  );
};

export default OrganisaatioHierarkiaTreeSelect;
