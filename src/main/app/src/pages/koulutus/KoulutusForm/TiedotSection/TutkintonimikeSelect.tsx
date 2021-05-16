import React, { useMemo } from 'react';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import useKoodisto from '#/src/hooks/useKoodisto';
import { formatKoodiLabelWithArvo } from '#/src/utils';

// Tämän nimi on "-------------" 'tutkintonimikekk'-koodistossa, eli on jonkinlainen tyhjää/tuntematonta vastaava arvo.
// Tarpeeton, koska Select-komponentista voi poistaa valinnan ja koutaan voidaan tallentaa oikeasti tyhjä arvo.
const UNKNOWN_TUTKINTONIMIKE = 'XX';

export const TutkintonimikeSelect = props => {
  const { data } = useKoodisto({ koodisto: 'tutkintonimikekk' });

  const koodistoData = useMemo(
    () => data?.filter(({ koodiArvo }) => koodiArvo !== UNKNOWN_TUTKINTONIMIKE),
    [data]
  );

  return (
    <AsyncKoodistoSelect
      koodistoData={koodistoData}
      isMulti
      showAllOptions={true}
      formatKoodiLabel={formatKoodiLabelWithArvo}
      {...props}
    />
  );
};

export default TutkintonimikeSelect;
