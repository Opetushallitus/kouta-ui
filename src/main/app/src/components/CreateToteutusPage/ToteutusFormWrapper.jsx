import React, { useMemo } from 'react';

import ToteutusForm from '../ToteutusForm';

import getToteutusFormConfig from '../../utils/getToteutusFormConfig';
import FormConfigContext from '../FormConfigContext';

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
