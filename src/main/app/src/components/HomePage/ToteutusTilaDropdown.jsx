import React from 'react';
import ApiTilaDropdown from './ApiTilaDropdown';

import { getAndUpdateKoutaToteutus } from '../../apiUtils';

const getUpdateProps = ({ oid, tila, ...rest }) => ({
  toteutus: { oid, tila },
  ...rest,
});

const ToteutusTilaDropdown = ({ initialTila, toteutusOid }) => {
  return (
    <ApiTilaDropdown
      initialTila={initialTila}
      oid={toteutusOid}
      getUpdateProps={getUpdateProps}
      updateFn={getAndUpdateKoutaToteutus}
    />
  );
};

export default ToteutusTilaDropdown;
