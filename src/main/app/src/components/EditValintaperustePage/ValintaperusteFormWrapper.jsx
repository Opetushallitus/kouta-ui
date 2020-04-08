import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';

const ValintaperusteFormWrapper = props => {
  const { koulutustyyppi } = props;

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
