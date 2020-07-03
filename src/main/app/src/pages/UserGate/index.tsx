import React, { useState, useEffect } from 'react';
import { useIdle, useEvent, useAsync } from 'react-use';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { UNAUTHORIZED } from 'http-status-codes';

import { IDLE_TIMEOUT, ERROR_INTERNET_DISCONNECTED } from '#/src/constants';
import { getMe } from '#/src/utils/api/getMe';
import { isDev } from '#/src/utils';
import useApiAsync from '#/src/hooks/useApiAsync';
import AuthorizedUserContext from '#/src/contexts/AuthorizedUserContext';
import SessionErrorModal from './SessionErrorModal';
import { useHttpClient, useUrls } from '#/src/contexts/contextHooks';

const UserGate = ({ fallback = null, children = null }) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  const [isFocused, setFocused] = useState(true);
  const [sessionErrorCode, setSessionErrorCode] = useState(null);

  const { data } = useApiAsync({ promiseFn: getMe });
  const isIdle = useIdle(IDLE_TIMEOUT);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (data && data.lang) {
      i18n.changeLanguage(data.lang);
    }
  }, [data, i18n]);

  useEvent('focus', () => setFocused(true), window);
  useEvent('blur', () => setFocused(false), window);

  // On mount redirect to login, if no session and not in dev-mode
  useAsync(async () => {
    try {
      await httpClient.get(apiUrls.url('kouta-backend.session'));
    } catch (e) {
      if (e?.response?.status === UNAUTHORIZED) {
        !isDev && window.location.replace(apiUrls.url('cas.login'));
      }
    }
  }, []);

  // When focusing or coming back from idle, check if the session is still valid
  useAsync(async () => {
    if (isFocused && !isIdle) {
      try {
        await httpClient.get(apiUrls.url('kouta-backend.session'), {
          errorNotifier: {
            silent: true,
          },
        });
        setSessionErrorCode(null);
      } catch (e) {
        console.log(get(e, 'response.status'));
        setSessionErrorCode(
          get(e, 'response.status') || ERROR_INTERNET_DISCONNECTED
        );
      }
    }
  }, [apiUrls, httpClient, isFocused, isIdle]);

  return (
    <>
      <SessionErrorModal
        {...{ sessionErrorCode, setSessionErrorCode, apiUrls, t }}
      />
      {data == null ? (
        fallback
      ) : (
        <AuthorizedUserContext.Provider value={data}>
          {children}
        </AuthorizedUserContext.Provider>
      )}
    </>
  );
};

export default UserGate;
