import React from 'react';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import Select from '#/src/components/Select';

export const KoulutusalaSelect = props => {
  const { options } = useKoodistoOptions({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
  });

  return <Select options={options} isMulti {...props} />;
};

export default KoulutusalaSelect;
