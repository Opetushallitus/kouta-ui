import { isBefore, isValid } from 'date-fns';

import { ENTITY, CRUD_ROLES } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

export const isHakukohteenTakarajaExpired = (now, takaraja) => {
  return now >= takaraja;
};

export const canUpdateHakukohde = (now, hakukohteenMuokkaamisenTakaraja) => {
  let canUpdateHakukohde = !isHakukohteenTakarajaExpired(
    now,
    hakukohteenMuokkaamisenTakaraja
  );

  return canUpdateHakukohde;
};

export const canCreateHakukohde = (now, hakukohteenLiittamisenTakaraja) => {
  let canUpdateHakukohde = !isHakukohteenTakarajaExpired(
    now,
    hakukohteenLiittamisenTakaraja
  );

  return canUpdateHakukohde;
};

export const useCanCreateHakukohde = (now, takaraja) => {
  const isOphVirkailija = useIsOphVirkailija();
  if (isOphVirkailija) {
    return true;
  }

  if (isValid(takaraja)) {
    return isBefore(now, takaraja);
  }

  return true;
};

// export const useCanSaveHakukohde = (now, takaraja, hakukohde = undefined) => {
//   const isOphVirkailija = useIsOphVirkailija();
//   const hasRightToUpdate = useCurrentUserHasRole(
//     ENTITY.HAKUKOHDE,
//     CRUD_ROLES.UPDATE,
//     hakukohde?.organisaatioOid
//   );
//   console.log({hakukohde})

//   console.log({hasRightToUpdate})
//   if (isOphVirkailija) {
//     return true;
//   }

//   if (hasRightToUpdate && (isValid(takaraja))) {
//     console.log("is valid")
//     console.log({now})
//     console.log({takaraja})
//     const result = isBefore(now, takaraja);
//     console.log({result})
//     return result;
//   }

//   return true;
// };
