import { useEffect, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

import HttpContext from '../HttpContext';
import { createGenericErrorToast } from '../../state/toaster';

export const HttpErrorNotifier = ({ onError = () => {} }) => {
  const httpClient = useContext(HttpContext);

  const onErrorThrottle = useMemo(() => {
    return throttle(onError, 5000);
  }, [onError]);

  useEffect(() => {
    const interceptor = httpClient.interceptors.response.use(
      response => response,
      error => {
        onErrorThrottle(error);

        return Promise.reject(error);
      },
    );

    return () => {
      httpClient.inteceptors.response.eject(interceptor);
    };
  }, [onErrorThrottle, httpClient]);

  return null;
};

export default connect(
  null,
  dispatch => ({
    onError: () => dispatch(createGenericErrorToast()),
  }),
)(HttpErrorNotifier);
