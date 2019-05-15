import React from 'react';

import Select from '../Select';
import useKoodistoOptions from '../useKoodistoOptions';

const OsiotSelect = props => {
  const { options } = useKoodistoOptions({
    koodisto: 'koulutuksenlisatiedot',
  });

  return <Select options={options} isMulti {...props} />;
};

export default OsiotSelect;
