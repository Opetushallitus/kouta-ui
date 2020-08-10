import React from 'react';

import { CheckboxGroup } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

const OpetustapaCheckboxGroup = props => {
  const { options } = useKoodistoOptions({ koodisto: 'opetuspaikkakk' });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetustapaCheckboxGroup;
