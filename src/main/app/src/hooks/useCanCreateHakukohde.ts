import { isBefore, isValid } from 'date-fns';

import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

export const useCanCreateHakukohde = hakukohteenLiittamisenTakaraja => {
  const now = new Date();
  let takaraja;
  if (hakukohteenLiittamisenTakaraja) {
    takaraja = new Date(hakukohteenLiittamisenTakaraja);
  }
  const isOphVirkailija = useIsOphVirkailija();
  if (isOphVirkailija) {
    return true;
  }

  if (isValid(takaraja)) {
    return isBefore(now, takaraja);
  }

  return true;
};
