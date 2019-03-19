import React, { useState, useCallback, useContext } from 'react';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import TilaDropdown from './TilaDropdown';
import useApiAsync from '../useApiAsync';

const ToteutusTilaDropdown = ({
  initialTila,
  oid,
  updateFn,
  getUpdateProps,
}) => {
  const [tila, setTila] = useState(initialTila);
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const { run: runUpdate } = useApiAsync({
    deferFn: updateFn,
  });

  const onChange = useCallback(
    async newTila => {
      try {
        await runUpdate(
          getUpdateProps({ oid, tila: newTila, httpClient, apiUrls }),
        );

        setTila(newTila);
      } catch (e) {}
    },
    [oid, setTila, httpClient, apiUrls],
  );

  return <TilaDropdown value={tila} onChange={onChange} />;
};

export default ToteutusTilaDropdown;
