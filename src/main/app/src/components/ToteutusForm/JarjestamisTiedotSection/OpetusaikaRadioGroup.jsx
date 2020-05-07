import React from 'react';

import { RadioGroup } from '@opetushallitus/virkailija-ui-components/RadioGroup';
import useKoodistoOptions from '#/src/components/useKoodistoOptions';

const OpetusaikaRadioGroup = props => {
  const { options } = useKoodistoOptions({ koodisto: 'opetusaikakk' });

  return <RadioGroup options={options} {...props} />;
};

export default OpetusaikaRadioGroup;
