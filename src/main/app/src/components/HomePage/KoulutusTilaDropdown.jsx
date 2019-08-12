import React from 'react';
import ApiTilaDropdown from './ApiTilaDropdown';

import getAndUpdateKoulutus from '../../utils/kouta/getAndUpdateKoulutus';

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
      updateFn={getAndUpdateKoulutus}
    />
  );
};

export default KoulutusTilaDropdown;
