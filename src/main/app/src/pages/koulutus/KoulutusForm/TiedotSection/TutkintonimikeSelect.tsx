import React from 'react';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import Select from '#/src/components/Select';

export const TutkintonimikeSelect = props => {
  const { options } = useKoodistoOptions({ koodisto: 'tutkintonimikekk' });

  return <Select options={options} isMulti {...props} />;
};

export default TutkintonimikeSelect;
