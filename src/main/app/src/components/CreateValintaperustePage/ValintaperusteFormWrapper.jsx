import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';
import useFieldValue from '../useFieldValue';

const ValintaperusteFormWrapper = props => {
  const koulutustyyppi = useFieldValue('perustiedot.tyyppi');

  const config = useMemo(() => getValintaperusteFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ValintaperusteForm {...props} />
    </FormConfigContext.Provider>
  );
};

export default ValintaperusteFormWrapper;
