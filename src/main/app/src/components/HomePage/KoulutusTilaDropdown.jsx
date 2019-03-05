import React from 'react';
import ApiTilaDropdown from './ApiTilaDropdown';

import { getAndUpdateKoutaKoulutus } from '../../apiUtils';

const getUpdateProps = ({ oid, tila, ...rest }) => ({
  koulutus: { oid, tila },
  ...rest,
});

const KoulutusTilaDropdown = ({ initialTila, koulutusOid }) => {
  return (
    <ApiTilaDropdown
      initialTila={initialTila}
      oid={koulutusOid}
      getUpdateProps={getUpdateProps}
      updateFn={getAndUpdateKoutaKoulutus}
    />
  );
};

export default KoulutusTilaDropdown;
