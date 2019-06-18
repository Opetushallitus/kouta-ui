import { useMemo } from 'react';

import useKoodisto from '../useKoodisto';
import parseKoodiUri from '../../utils/parseKoodiUri';
import { isArray } from '../../utils';

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
