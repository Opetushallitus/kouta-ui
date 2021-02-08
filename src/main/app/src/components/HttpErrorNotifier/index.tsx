import { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { useHttpClient } from '#/src/contexts/contextHooks';
import { useToaster } from '#/src/hooks/useToaster';
import { otherwise } from '#/src/utils';

const getToastOptions = (error, t) => {
  const { response } = error;
  const status = response?.status;
  const data = response?.data;

  const label = _fp.cond([
    [_fp.equals(403), () => t('ilmoitukset.kayttooikeusVirhe')],
    [otherwise, () => t('ilmoitukset.tuntematonVirhe.viesti')],
  ])(status);

  return {
    status: 'danger',
    label,
    error: status >= 400 && data,
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
