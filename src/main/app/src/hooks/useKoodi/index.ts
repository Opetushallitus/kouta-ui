import { useMemo } from 'react';

import _ from 'lodash';

import useKoodisto from '#/src/hooks/useKoodisto';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const useKoodi = koodiUri => {
  const { koodisto, koodi } = useMemo(
    () => parseKoodiUri(koodiUri),
    [koodiUri]
  );

  // Not passing koodisto version parsed from koodiUri here, because we
  // want to use the latest koodisto. Also if a single koodi tries to fetch
  // koodisto again for an older koodisto versio this will return empty data.
  const { data, ...rest } = useKoodisto({ koodisto });

  const koodistoKoodi = useMemo(() => {
    return _.isArray(data) ? data.find(k => k.koodiUri === koodi) : undefined;
  }, [data, koodi]);

  return { koodi: koodistoKoodi, ...rest };
};

export default useKoodi;
