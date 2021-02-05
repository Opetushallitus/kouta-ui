import React from 'react';

import { orderBy } from 'lodash';

import { CheckboxGroup } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

const OpetuskieliCheckboxGroup = props => {
  const sort = options => {
    const fixedOrder = ['suomi', 'ruotsi', 'englanti', 'muu'];
    const byLabel = ({ label }) => label;
    const byFixedOrder = ({ label }) => {
      const order = fixedOrder.indexOf(label);
      return order !== -1 ? order : Number.MAX_SAFE_INTEGER;
    };
    return orderBy(options, [byFixedOrder, byLabel]);
  };

  const { options } = useKoodistoOptions({
    koodisto: 'oppilaitoksenopetuskieli',
    sortFn: sort,
  });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetuskieliCheckboxGroup;
