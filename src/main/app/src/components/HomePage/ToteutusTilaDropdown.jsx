import React from 'react';

import ApiTilaDropdown from './ApiTilaDropdown';
import getAndUpdateToteutus from '../../utils/kouta/getAndUpdateToteutus';

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
      updateFn={getAndUpdateToteutus}
    />
  );
};

export default ToteutusTilaDropdown;
