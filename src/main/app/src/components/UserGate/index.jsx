import React, { useState, useContext, useEffect } from 'react';
import { useIdle, useEvent, useAsync } from 'react-use';
import { get } from 'lodash';
import styled from 'styled-components';
import { getMe } from '../../apiUtils';
import { isDev } from '../../utils';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';
import AuthorizedUserContext from '../AuthorizedUserContext';
import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import ModalFooter from '../ModalFooter';
import Button from '../Button';
import Flex from '../Flex';

const IDLE_TIMEOUT = 30e3; // 30 seconds
const RESPONSE_ERROR_UNAUTHORIZED = 401;
const RESPONSE_ERROR_UNKNOWN = 'RESPONSE_ERROR_UNKNOWN';

const MyButton = styled(Button)`
  margin-left: 1em;
`;

const SessionErrorModal = ({ sessionError, setSessionError, apiUrls, t }) => {
  return (
    <Modal open={sessionError}>
      <ModalHeader>
        {sessionError === RESPONSE_ERROR_UNAUTHORIZED
          ? t('ilmoitukset.istuntoVirhe.otsikko')
          : t('ilmoitukset.yhteysVirhe.otsikko')}
      </ModalHeader>
      <ModalBody>
        {sessionError === RESPONSE_ERROR_UNAUTHORIZED
          ? t('ilmoitukset.istuntoVirhe.viesti')
          : t('ilmoitukset.yhteysVirhe.viesti')}
      </ModalBody>
      <ModalFooter>
        <Flex justifyEnd>
          <MyButton
            onClick={() =>
              isDev
                ? window.open(apiUrls.url('cas.login'))
                : window.location.replace(apiUrls.url('cas.login'))
            }
          >
            {t('yleiset.meneLoginSivulle')}
          </MyButton>
          <MyButton
            marginLeft={1}
            color="danger"
            onClick={() => setSessionError(null)}
          >
            {t('yleiset.suljeVaroitus')}
          </MyButton>
        </Flex>
      </ModalFooter>
    </Modal>
  );
};

const UserGate = ({ fallback = null, children = null }) => {
  const { data } = useApiAsync({ promiseFn: getMe });
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (data && data.lang) {
      i18n.changeLanguage(data.lang);
    }
  }, [data, i18n]);

  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);
  const isIdle = useIdle(IDLE_TIMEOUT);
  const [sessionError, setSessionError] = useState(null);
  const [isFocused, setFocused] = useState(true);

  useEvent('focus', () => setFocused(true), window);
  useEvent('blur', () => setFocused(false), window);

  // On mount redirect to login, if no session and not in dev-mode
  useAsync(async () => {
    try {
      await httpClient.get(apiUrls.url('kouta-backend.session'));
    } catch (e) {
      if (get(e, 'response.status') === RESPONSE_ERROR_UNAUTHORIZED) {
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
        setSessionError(null);
      } catch (e) {
        const status = get(e, 'response.status') || RESPONSE_ERROR_UNKNOWN;
        setSessionError(status);
      }
    }
  }, [isFocused, isIdle, httpClient, apiUrls]);

  return (
    <>
      <SessionErrorModal {...{ sessionError, setSessionError, apiUrls, t }} />
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
