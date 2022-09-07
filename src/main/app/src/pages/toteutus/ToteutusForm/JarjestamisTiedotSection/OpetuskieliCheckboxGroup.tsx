import React from 'react';

import _ from 'lodash';

import { CheckboxGroup } from '#/src/components/virkailija';
import { FormMode } from '#/src/constants';
import { useFormMode } from '#/src/contexts/FormContext';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const OpetuskieliCheckboxGroup = props => {
  const sort = options => {
    const fixedOrder = ['suomi', 'ruotsi', 'englanti', 'muu'];
    const byLabel = ({ label }) => label;
    const byFixedOrder = ({ label }) => {
      const order = fixedOrder.indexOf(label);
      return order === -1 ? Number.MAX_SAFE_INTEGER : order;
    };
    return _.sortBy(options, [byFixedOrder, byLabel]);
  };

  // Tämä on pikakorjaus siihen, että oppilaitoksenopetuskieli-koodiston uusi versio rikkoi opetuskielen näyttämisen
  // TODO: Toteuta koodistojen tallennus ilman versiota ja käytä lomakkeella myös versiottomia koodisto-arvoja
  const formMode = useFormMode();

  const fieldValue = useFieldValue(props?.name);
  const firstValue = fieldValue?.[0];

  let koodistoVersio;
  if (formMode === FormMode.EDIT) {
    const { versio } = parseKoodiUri(firstValue);
    koodistoVersio = versio;
  }

  const { options } = useKoodistoOptions({
    koodisto: 'oppilaitoksenopetuskieli',
    sortFn: sort,
    versio: koodistoVersio,
  });

  return <CheckboxGroup options={options} {...props} />;
};

export default OpetuskieliCheckboxGroup;
