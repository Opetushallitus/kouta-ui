import React from 'react';

import Select from '../Select';
import useKoodistoOptions from '../useKoodistoOptions';

const LanguageSelect = props => {
  const { options } = useKoodistoOptions({ koodisto: 'kieli' });

  return <Select options={options} {...props} />;
};

export default LanguageSelect;
