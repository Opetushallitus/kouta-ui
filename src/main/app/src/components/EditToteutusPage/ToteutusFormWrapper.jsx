import React, { useMemo } from 'react';

import ToteutusForm from '../ToteutusForm';
import FormConfigContext from '../FormConfigContext';
import getToteutusFormConfig from '../../utils/getToteutusFormConfig';

const ToteutusFormWrapper = props => {
  const { koulutustyyppi } = props;

  const config = useMemo(() => getToteutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ToteutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

export default ToteutusFormWrapper;
