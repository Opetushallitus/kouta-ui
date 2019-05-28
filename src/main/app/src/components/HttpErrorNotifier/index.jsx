import { useEffect, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import get from 'lodash/get';

import HttpContext from '../HttpContext';
import { createTemporaryToast } from '../../state/toaster';
import useTranslation from '../useTranslation';

const createErrorToast = (error, t) => {
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

export const HttpErrorNotifier = ({ onError = () => {} }) => {
  const httpClient = useContext(HttpContext);
  const { t } = useTranslation();

  const onErrorThrottle = useMemo(() => {
    return throttle(onError, 5000);
  }, [onError]);

  useEffect(() => {
    const interceptor = httpClient.interceptors.response.use(
      response => response,
      error => {
        onErrorThrottle(createErrorToast(error, t));

        return Promise.reject(error);
      },
    );

    return () => {
      httpClient.interceptors.response.eject(interceptor);
    };
  }, [onErrorThrottle, httpClient, t]);

  return null;
};

export default connect(
  null,
  dispatch => ({
    onError: args => dispatch(createTemporaryToast(args)),
  }),
)(HttpErrorNotifier);
