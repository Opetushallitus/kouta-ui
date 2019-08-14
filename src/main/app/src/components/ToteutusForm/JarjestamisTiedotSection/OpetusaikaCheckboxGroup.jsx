import React from 'react';

import CheckboxGroup from '../../CheckboxGroup';
import useKoodistoOptions from '../../useKoodistoOptions';

const OpetusaikaRadioGroup = props => {
  const { options } = useKoodistoOptions({ koodisto: 'opetusaikakk' });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetusaikaRadioGroup;
