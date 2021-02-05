import React from 'react';

import Select from '#/src/components/Select';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

export const TutkintonimikeSelect = props => {
  const { options } = useKoodistoOptions({ koodisto: 'tutkintonimikekk' });

  return <Select options={options} isMulti {...props} />;
};

export default TutkintonimikeSelect;
