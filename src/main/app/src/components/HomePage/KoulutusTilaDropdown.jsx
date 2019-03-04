import React, { useState, useCallback, useContext } from 'react';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import TilaDropdown from './TilaDropdown';
import useApiAsync from '../useApiAsync';
import { getAndUpdateKoutaKoulutus } from '../../apiUtils';

const KoulutusTilaDropdown = ({ initialTila, koulutusOid }) => {
  const [tila, setTila] = useState(initialTila);
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const { run: runUpdate } = useApiAsync({
    deferFn: getAndUpdateKoutaKoulutus,
  });

  const onChange = useCallback(
    async newTila => {
      try {
        await runUpdate({
          koulutus: { oid: koulutusOid, tila: newTila },
          httpClient,
          apiUrls,
        });

        setTila(newTila);
      } catch (e) {}
    },
    [koulutusOid, setTila, httpClient, apiUrls],
  );

  return <TilaDropdown value={tila} onChange={onChange} />;
};

export default KoulutusTilaDropdown;
