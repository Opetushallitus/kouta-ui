import { Globals } from '@react-spring/web';
import { urls as ophUrls } from 'oph-urls-js';
import { createRoot } from 'react-dom/client';

import createHttpClient from './httpClient';
import { createDefaultLocalization } from './localization';
import App from './pages/App';
import defaultTheme from './theme';
import { configure as configureUrls } from './urls';
import { isPlaywright } from './utils';
import { migrateLegacyStorage } from './utils/organisaatioValintaStorage';
import './utils/xstateInspector';

Globals.assign({
  skipAnimation: isPlaywright,
});

(async () => {
  let apiUrls = ophUrls;

  const httpClient = createHttpClient({
    apiUrls,
    callerId: import.meta.env.VITE_CALLER_ID,
  });

  apiUrls = await configureUrls(apiUrls, httpClient);

  const localizationInstance = await createDefaultLocalization({
    httpClient,
    apiUrls,
  });

  migrateLegacyStorage();

  const root = createRoot(document.getElementById('root') as Element);

  root.render(
    <App
      theme={defaultTheme}
      urls={apiUrls}
      httpClient={httpClient}
      localization={localizationInstance}
    />
  );
})();
