import { UNAUTHORIZED } from 'http-status-codes';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsync, useEvent, useIdle } from 'react-use';
import {
  ERROR_INTERNET_DISCONNECTED,
  ERROR_KAYTTOOIKEUS_SERVICE,
  IDLE_TIMEOUT,
} from '#/src/constants';
import AuthorizedUserContext from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient, useUrls } from '#/src/contexts/contextHooks';
import useApiAsync from '#/src/hooks/useApiAsync';
import { isDev } from '#/src/utils';
import { getMe } from '#/src/utils/api/getMe';
import AuthorizationErrorModal from './AuthorizationErrorModal';

export const UserGate = ({ fallback = null, children = null }) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  const [isFocused, setFocused] = useState(true);
  const [errorCode, setErrorCode] = useState<string | number | null>(null);

  const { data, error: getMeError } = useApiAsync({ promiseFn: getMe });
  const isLoaded = !!data?.oid;
  const isIdle = useIdle(IDLE_TIMEOUT);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // NOTE: Not sure what could be the case when data does exists but oid does not, but this has probably happened few times
    if (getMeError || (data && !data.oid)) {
      setErrorCode(ERROR_KAYTTOOIKEUS_SERVICE);
    }
  }, [data, getMeError]);

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
        if (isLoaded) {
          setErrorCode(null);
        }
      } catch (e) {
        console.error(e?.response?.status);
        setErrorCode(e?.response?.status || ERROR_INTERNET_DISCONNECTED);
      }
    }
  }, [apiUrls, httpClient, isFocused, isIdle]);

  return (
    <>
      <AuthorizationErrorModal {...{ errorCode, setErrorCode, apiUrls, t }} />
      {!isLoaded ? (
        fallback
      ) : (
        <AuthorizedUserContext.Provider value={data}>
          {children}
        </AuthorizedUserContext.Provider>
      )}
    </>
  );
};
