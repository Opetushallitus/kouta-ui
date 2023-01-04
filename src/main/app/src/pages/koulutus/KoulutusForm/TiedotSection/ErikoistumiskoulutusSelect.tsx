import React from 'react';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import useKoodisto from '#/src/hooks/useKoodisto';

export const ErikoistumiskoulutusSelect = props => {
  const { data } = useKoodisto({ koodisto: 'erikoistumiskoulutukset' });

  return (
    <AsyncKoodistoSelect
      koodistoData={data}
      isMulti={false}
      showAllOptions={true}
      {...props}
    />
  );
};

export default ErikoistumiskoulutusSelect;
