import { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash/fp';

import HttpContext from '#/src/components/HttpContext';
import useToaster from '#/src/components/useToaster';
import { otherwise } from '#/src/utils';

const getToastOptions = (error, t) => {
  const { response } = error;
  const status = response?.status;
  const data = response?.data;

  const label = _.cond([
    [_.equals(403), () => t('ilmoitukset.kayttooikeusVirhe')],
    [otherwise, () => t('ilmoitukset.tuntematonVirhe')],
  ])(status);

  return {
    status: 'danger',
    label,
    error: status >= 400 && data,
  };
};

export const HttpErrorNotifier = () => {
  const { openToast } = useToaster();
  const httpClient = useContext(HttpContext);
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
