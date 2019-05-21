import React from 'react';

import useKoodistoOptions from '../../useKoodistoOptions';
import Select from '../../Select';

export const KoulutusalatSelect = props => {
  const { options } = useKoodistoOptions({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
  });

  return <Select options={options} isMulti {...props} />;
};

export default KoulutusalatSelect;
