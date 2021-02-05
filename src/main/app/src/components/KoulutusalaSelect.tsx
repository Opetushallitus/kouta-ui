import React from 'react';

import { Select } from '#/src/components/Select';
import { useKoodistoOptions } from '#/src/hooks/useKoodistoOptions';

export const KoulutusalaSelect = props => {
  const { options } = useKoodistoOptions({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
  });

  return <Select options={options} {...props} />;
};

export default KoulutusalaSelect;
