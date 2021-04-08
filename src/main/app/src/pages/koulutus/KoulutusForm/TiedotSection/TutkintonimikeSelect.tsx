import React, { useMemo } from 'react';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import useKoodisto from '#/src/hooks/useKoodisto';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

export const TutkintonimikeSelect = props => {
  const { data } = useKoodisto({ koodisto: 'tutkintonimikekk' });

  const koodistoData = useMemo(
    () => data?.filter(({ koodiArvo }) => koodiArvo !== 'XX'),
    [data]
  );

  return (
    <AsyncKoodistoSelect
      koodistoData={koodistoData}
      isMulti
      showAllOptions={true}
      formatKoodiLabel={(koodi, language) =>
        `${getKoodiNimiTranslation(koodi, language)} (${koodi.koodiArvo})`
      }
      {...props}
    />
  );
};

export default TutkintonimikeSelect;
