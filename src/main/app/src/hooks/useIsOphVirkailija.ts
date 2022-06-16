import { useMemo } from 'react';

import {
  OPETUSHALLITUS_ORGANISAATIO_OID,
  OPH_PAAKAYTTAJA_ROLE,
} from '../constants';
import useAuthorizedUserRoleBuilder from './useAuthorizedUserRoleBuilder';

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
