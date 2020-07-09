import React from 'react';

import CheckboxGroup from '#/src/components/CheckboxGroup';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

const OpetusaikaRadioGroup = props => {
  const { options } = useKoodistoOptions({ koodisto: 'opetusaikakk' });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetusaikaRadioGroup;
