import React from 'react';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import useKoodisto from '#/src/hooks/useKoodisto';

export const KoulutusalaSelect = props => {
  const { data } = useKoodisto({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
  });

  return <AsyncKoodistoSelect koodistoData={data} showAllOptions {...props} />;
};

export default KoulutusalaSelect;
