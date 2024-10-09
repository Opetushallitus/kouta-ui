import { useMemo } from 'react';

import { useOsaamismerkkiById } from '#/src/utils/ePeruste/getOsaamismerkki';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

export const useOsaamismerkki = (koodiUri: string | undefined) => {
  const { koodi } = useMemo(() => parseKoodiUri(koodiUri), [koodiUri]);

  return useOsaamismerkkiById(koodi);
};
