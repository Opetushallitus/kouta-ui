import React from 'react';

import CheckboxGroup from '../CheckboxGroup';
import useKoodistoOptions from '../useKoodistoOptions';

const OpetustapaCheckboxGroup = props => {
  const { options } = useKoodistoOptions({ koodisto: 'opetuspaikkakk' });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetustapaCheckboxGroup;
