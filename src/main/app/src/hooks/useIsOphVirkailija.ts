import { useMemo } from 'react';
import { KOULUTUS_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID } from '../constants';
import useAuthorizedUserRoleBuilder from './useAuthorizedUserRoleBuilder';

export const useIsOphVirkailija = () => {
  const roleBuilder = useAuthorizedUserRoleBuilder();

  return useMemo(
    () =>
      roleBuilder
        .hasUpdate(KOULUTUS_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID)
        .result(),
    [roleBuilder]
  );
};
