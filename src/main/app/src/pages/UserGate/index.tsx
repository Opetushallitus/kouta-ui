import React, { useEffect, useState } from 'react';

import { StatusCodes } from 'http-status-codes';
import { useTranslation } from 'react-i18next';
import { useAsync, useEvent, useIdle } from 'react-use';

import {
  ERROR_INTERNET_DISCONNECTED,
  ERROR_KAYTTOOIKEUS_SERVICE,
  IDLE_TIMEOUT,
  LANGUAGES,
} from '#/src/constants';
import AuthorizedUserContext from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useAsiointiKieli } from '#/src/utils/api/getAsiointiKieli';
import { useKayttoOikeusOmatTiedot } from '#/src/utils/api/getKayttoOikeusOmatTiedot';

import AuthorizationErrorModal from './AuthorizationErrorModal';

type UserGateProps = {
  fallback?: React.ReactElement;
  children?: React.ReactNode;
};

export const UserGate = ({ fallback, children }: UserGateProps) => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  const [isFocused, setFocused] = useState(true);
  const [errorCode, setErrorCode] = useState<string | number | null>(null);

  const { data, error: omatTiedotError } = useKayttoOikeusOmatTiedot();
  const isLoaded = Boolean(data?.oidHenkilo);
  const isIdle = useIdle(IDLE_TIMEOUT);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // NOTE: Not sure what could be the case when data does exists but oid does not, but this has probably happened few times
    if (!errorCode && (omatTiedotError || (data && !data.oidHenkilo))) {
      setErrorCode(ERROR_KAYTTOOIKEUS_SERVICE);
    }
  }, [data, errorCode, omatTiedotError]);

  useEvent('focus', () => setFocused(true), window);
  useEvent('blur', () => setFocused(false), window);

  // On mount redirect to login, if no session and not in dev-mode
  useAsync(async () => {
    try {
      await httpClient.get(apiUrls.url('kouta-backend.session'));
    } catch (e) {
      if (e?.response?.status === StatusCodes.UNAUTHORIZED) {
        window.location.replace(
          apiUrls.url('cas.login') +
            '?service=' +
            encodeURIComponent(window.location.href)
        );
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

  const { data: asiointiKieli, isLoading: isLoadingAsiointiKieli } =
    useAsiointiKieli();

  useEffect(() => {
    const newLanguage = LANGUAGES.includes(asiointiKieli)
      ? asiointiKieli
      : 'fi';
    if (i18n.language !== newLanguage) {
      i18n.changeLanguage(newLanguage);
    }
  });

  return (
    <>
      <AuthorizationErrorModal {...{ errorCode, setErrorCode, apiUrls, t }} />
      {!isLoaded || isLoadingAsiointiKieli ? (
        fallback
      ) : (
        <AuthorizedUserContext.Provider value={data}>
          {children}
        </AuthorizedUserContext.Provider>
      )}
    </>
  );
};
