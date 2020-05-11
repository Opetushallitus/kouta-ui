import React, { useMemo } from 'react';

import KoulutusForm from '../KoulutusForm';
import { useFieldValue } from '#/src/hooks/form';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';
import FormConfigContext from '../FormConfigContext';

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

export default KoulutusFormWrapper;
