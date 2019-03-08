import React from 'react';

import useKoodistoOptions from '../../useKoodistoOptions';
import Select from '../../Select';

export const TutkintonimikeSelect = props => {
  const { options } = useKoodistoOptions({ koodisto: 'tutkintonimikekk' });

  return <Select options={options} isMulti {...props} />
};

export default TutkintonimikeSelect;
