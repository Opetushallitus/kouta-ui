import { isBefore, isValid } from 'date-fns';

import { ENTITY, CRUD_ROLES } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

import { HakukohdeModel } from '../types/domainTypes';

export const useCanUpdateHakukohde = (
  hakukohteenMuokkaamisenTakaraja?: string,
  hakukohde: HakukohdeModel | undefined = undefined
) => {
  let result: {
    canUpdate: boolean;
    reasonKey?: string;
  } = {
    canUpdate: true,
  };
  const isOphVirkailija = useIsOphVirkailija();
  const hasRightToUpdate = useCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE,
    hakukohde?.organisaatioOid
  );

  if (isOphVirkailija) {
    return result;
  } else if (hakukohteenMuokkaamisenTakaraja && hasRightToUpdate) {
    const now = new Date();
    const takaraja = new Date(hakukohteenMuokkaamisenTakaraja);
    if (isValid(takaraja)) {
      const isBeforeTakaraja = isBefore(now, takaraja);
      if (!isBeforeTakaraja) {
        result = {
          canUpdate: false,
          reasonKey: 'muokkaamisenTakarajaYlittynyt',
        };
      }
    }
  } else if (hasRightToUpdate) {
    return result;
  } else {
    result = {
      canUpdate: false,
      reasonKey: 'eiMuokkausOikeutta',
    };
  }

  return result;
};
