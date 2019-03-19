import React from 'react';

import Radio, { RadioGroup } from '../Radio';
import useKoodistoOptions from '../useKoodistoOptions';

const OpetusaikaRadioGroup = props => {
  const { options } = useKoodistoOptions({ koodisto: 'opetusaikakk' });

  return (
    <RadioGroup {...props}>
      {options.map(({ label, value }) => (
        <Radio key={value} value={value}>
          {label}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default OpetusaikaRadioGroup;
