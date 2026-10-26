import React from 'react';

import UiVirkailijaRaamit from '@opetushallitus/virkailija-ui-components/VirkailijaRaamit';

import { useUrls } from '#/src/contexts/UrlContext';

const getScriptUrl = urls => {
  let scriptUrl: string | undefined;

  try {
    scriptUrl = urls.url('virkailija-raamit.raamitJs');
  } catch {}

  return scriptUrl;
};

const VirkailijaRaamit = () => {
  const urls = useUrls();
  const scriptUrl = getScriptUrl(urls);

  return scriptUrl ? <UiVirkailijaRaamit scriptUrl={scriptUrl} /> : null;
};

export default VirkailijaRaamit;
