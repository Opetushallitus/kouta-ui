import { useMemo } from 'react';
import { isArray } from 'lodash';

import useKoodisto from '../useKoodisto';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const useKoodi = koodiUri => {
  const { koodisto, versio, koodi } = useMemo(() => parseKoodiUri(koodiUri), [
    koodiUri,
  ]);

  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const koodistoKoodi = useMemo(() => {
    return isArray(data) ? data.find(k => k.koodiUri === koodi) : undefined;
  }, [data, koodi]);

  return { koodi: koodistoKoodi, ...rest };
};

export default useKoodi;
