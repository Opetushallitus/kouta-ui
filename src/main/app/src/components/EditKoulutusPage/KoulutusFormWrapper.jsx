import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import KoulutusForm from '../KoulutusForm';
import FormConfigContext from '../FormConfigContext';
import useFieldValue from '../useFieldValue';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';

const KoulutusFormWrapper = props => {
  const koulutustyyppi = useFieldValue('koulutustyyppi');

  const config = useMemo(() => getKoulutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <KoulutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

export default withRouter(KoulutusFormWrapper);
