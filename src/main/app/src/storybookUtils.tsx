import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import Async from 'react-async';
import { urls as ophUrls } from 'oph-urls-js';
import axios from 'axios';
import { I18nextProvider } from 'react-i18next';

import createStore from './state/store';
import { configure as configureUrls } from './urls';
import HttpContext from './contexts/HttpClientContext';
import UrlContext from '#/src/contexts/UrlContext';
import { getFormConfigByEntity } from '#/src/hooks/form';
import createLocalization from './localization';
import getTranslations from './translations';
import FormConfigContext from './contexts/FormConfigContext';
import ReduxForm from './components/ReduxForm';
import { KOULUTUSTYYPPI } from './constants';
import FormConfigSectionContext from './contexts/FormConfigSectionContext';

const defaultHttpClient = axios.create({});
const configureOphUrls = () => configureUrls(ophUrls, defaultHttpClient);

const getLocalizationInstance = () => {
  const localizationInstance = createLocalization({
    debug: true,
  });

  localizationInstance.addResourceBundle(
    'fi',
    'kouta',
    getTranslations().fi.kouta,
    true
  );

  return localizationInstance;
};

export const makeApiDecorator = ({
  httpClient = defaultHttpClient,
} = {}) => storyFn => {
  return (
    <HttpContext.Provider value={httpClient}>
      <Async promiseFn={configureOphUrls}>
        {({ data }) =>
          data ? (
            <UrlContext.Provider value={data}>{storyFn()}</UrlContext.Provider>
          ) : null
        }
      </Async>
    </HttpContext.Provider>
  );
};

export const makeStoreDecorator = ({ logging = false } = {}) => storyFn => {
  const { store } = createStore({});
  const storeAction = action('change');

  if (logging) {
    store.subscribe(() => {
      storeAction(store.getState());
    });
  }

  return <Provider store={store}>{storyFn()}</Provider>;
};

export const makeLocalizationDecorator = () => storyFn => {
  const instance = getLocalizationInstance();

  return (
    <Suspense fallback={null}>
      <I18nextProvider i18n={instance}>{storyFn()}</I18nextProvider>
    </Suspense>
  );
};

export const makeFormDecorator = (
  entityType,
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
) => storyFn => {
  const content = storyFn();
  const config = getFormConfigByEntity(entityType, koulutustyyppi);
  return (
    <ReduxForm form={entityType}>
      <FormConfigContext.Provider value={config}>
        {content}
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export const makeFormSectionDecorator = sectionName => storyFn => (
  <FormConfigSectionContext.Provider value={sectionName}>
    {storyFn()}
  </FormConfigSectionContext.Provider>
);
