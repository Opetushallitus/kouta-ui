import React, { useLayoutEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';

import UrlContext from '../UrlContext';

const getScriptUrl = urls => {
  let scriptUrl = null;

  try {
    scriptUrl = urls.url('virkailija-raamit.raamitJs');
  } catch {}

  return scriptUrl;
};

const VirkalijaRaamit = () => {
  const urls = useContext(UrlContext);
  const scriptUrl = getScriptUrl(urls);
  const containerRef = useRef();

  if (!containerRef.current) {
    containerRef.current = document.createElement('div');
  }

  useLayoutEffect(() => {
    document.body.appendChild(containerRef.current);

    return () => {
      document.body.removeChild(containerRef.current);
    };
  });

  const showRaamit = !!scriptUrl;

  return createPortal(
    showRaamit ? <script src={scriptUrl} /> : null,
    containerRef.current,
  );
};

export default VirkalijaRaamit;
