import { useEffect, useContext, useMemo } from 'react';
import throttle from 'lodash/throttle';
import get from 'lodash/get';

import HttpContext from '../HttpContext';
import useTranslation from '../useTranslation';
import useToaster from '../useToaster';

const getToastOptions = (error, t) => {
  const status = get(error, 'response.status');

  let title = t('yleiset.virheilmoitus');
  let description = t('yleiset.virheilmoitusKuvaus');

  if (status === 403) {
    title = t('yleiset.kayttooikeusVirheilmoitus');
    description = t('yleiset.kayttooikeusVirheilmoitusKuvaus');
  }

  return {
    status: 'danger',
    title,
    description,
  };
};

export const HttpErrorNotifier = () => {
  const { openToast } = useToaster();
  const httpClient = useContext(HttpContext);
  const { t } = useTranslation();

  const openToastThrottle = useMemo(() => {
    return throttle(openToast, 3000, { trailing: false });
  }, [openToast]);

  useEffect(() => {
    const interceptor = httpClient.interceptors.response.use(
      response => response,
      error => {
        const isSilent = Boolean(get(error, 'config.errorNotifier.silent'));

        if (!isSilent) {
          openToastThrottle(getToastOptions(error, t));
        }

        return Promise.reject(error);
      },
    );

    return () => {
      httpClient.interceptors.response.eject(interceptor);
    };
  }, [openToastThrottle, httpClient, t]);

  return null;
};

export default HttpErrorNotifier;
