import { useEffect, useContext } from 'react';
import UrlContext from '../UrlContext';

const getScriptUrl = urls => {
  let scriptUrl = null;

  try {
    scriptUrl = urls.url('virkailija-raamit.raamitJs');
  } catch {}

  return scriptUrl;
};

const raamitId = `virkailijaRaamit__${Math.round(Math.random() * 1000)}`;

const VirkalijaRaamit = () => {
  const urls = useContext(UrlContext);
  const scriptUrl = getScriptUrl(urls);
  const showRaamit = !!scriptUrl;

  useEffect(() => {
    let scriptElement;

    if (showRaamit && !document.getElementById(raamitId)) {
      scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.id = raamitId;

      document.body.appendChild(scriptElement);
    }

    return () => {
      scriptElement && document.body.removeChild(scriptElement);
    };
  });

  return null;
};

export default VirkalijaRaamit;
