import React from 'react';

import Select from '#/src/components/Select';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

const LanguageSelect = props => {
  const { options } = useKoodistoOptions({ koodisto: 'kieli' });

  return <Select options={options} {...props} />;
};

export default LanguageSelect;
