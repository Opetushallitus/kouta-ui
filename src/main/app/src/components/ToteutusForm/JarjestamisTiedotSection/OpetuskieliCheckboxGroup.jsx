import React from 'react';

import CheckboxGroup from '../../CheckboxGroup';
import useKoodistoOptions from '../../useKoodistoOptions';

const OpetuskieliCheckboxGroup = props => {
  const { options } = useKoodistoOptions({
    koodisto: 'oppilaitoksenopetuskieli',
  });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetuskieliCheckboxGroup;
