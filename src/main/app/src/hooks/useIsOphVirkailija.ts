import { useMemo } from 'react';

import useAuthorizedUserRoleBuilder from './useAuthorizedUserRoleBuilder';
import {
  OPETUSHALLITUS_ORGANISAATIO_OID,
  OPH_PAAKAYTTAJA_ROLE,
} from '../constants';

export const useIsOphVirkailija = () => {
  const roleBuilder = useAuthorizedUserRoleBuilder();

  return useMemo(
    () =>
      roleBuilder
        .hasUpdate(OPH_PAAKAYTTAJA_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID)
        .result(),
    [roleBuilder]
  );
};
