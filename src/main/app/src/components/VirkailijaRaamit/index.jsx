import React, { useContext } from 'react';
import UiVirkailijaRaamit from '@opetushallitus/virkailija-ui-components/VirkailijaRaamit';

import UrlContext from '../UrlContext';

const getScriptUrl = urls => {
  let scriptUrl = null;

  try {
    scriptUrl = urls.url('virkailija-raamit.raamitJs');
  } catch {}

  return scriptUrl;
};

const VirkailijaRaamit = () => {
  const urls = useContext(UrlContext);
  const scriptUrl = getScriptUrl(urls);

  return <UiVirkailijaRaamit scriptUrl={scriptUrl} />;
};

export default VirkailijaRaamit;
