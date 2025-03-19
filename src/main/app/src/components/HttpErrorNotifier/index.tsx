import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useToaster } from '#/src/hooks/useToaster';

const getToastOptions = (error, t) => {
  const { response } = error;
  const status = response?.status;
  const data = response?.data;

  const label = match(status)
    .with(404, () => t('ilmoitukset.kohdettaEiLoydy'))
    .with(403, () => t('ilmoitukset.kayttooikeusVirhe'))
    .with(400, () => t('ilmoitukset.virheellinenPalvelinpyynto'))
    .otherwise(() => t('ilmoitukset.tuntematonVirhe.viesti'));

  return {
    status: 'danger',
    label,
    error: status >= 400 && status !== 404 && data,
  };
};

export const HttpErrorNotifier = () => {
  const { openToast } = useToaster();
  const httpClient = useHttpClient();
  const { t } = useTranslation();

  useEffect(() => {
    const interceptor = httpClient.interceptors.response.use(
      response => response,
      error => {
        const isSilent = error?.config?.errorNotifier?.silent;

        if (!isSilent) {
          openToast(getToastOptions(error, t));
        }

        return Promise.reject(error);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptor);
    };
  }, [openToast, httpClient, t]);

  return null;
};

export default HttpErrorNotifier;
