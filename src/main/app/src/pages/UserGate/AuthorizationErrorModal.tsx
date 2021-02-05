import React from 'react';

import { UNAUTHORIZED } from 'http-status-codes';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import Flex from '#/src/components/Flex';
import Modal from '#/src/components/Modal';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';
import {
  ERROR_INTERNET_DISCONNECTED,
  ERROR_KAYTTOOIKEUS_SERVICE,
} from '#/src/constants';
import { isDev } from '#/src/utils';

const ModalButton = styled(Button)`
  margin-left: 1em;
`;

const getErrorTranslationKeyPrefix = (code: string | number) => {
  switch (code) {
    case UNAUTHORIZED:
      return 'ilmoitukset.istuntoVirhe';
    case ERROR_INTERNET_DISCONNECTED:
      return 'ilmoitukset.yhteysVirhe';
    case ERROR_KAYTTOOIKEUS_SERVICE:
      return 'ilmoitukset.kayttooikeusHakuVirhe';
    default:
      return 'ilmoitukset.tuntematonVirhe';
  }
};

export default function AuthorizationErrorModal({
  errorCode,
  setErrorCode,
  apiUrls,
  t,
}) {
  const errorKeyPrefix = getErrorTranslationKeyPrefix(errorCode);
  return (
    <Modal open={errorCode}>
      <ModalHeader>{t(`${errorKeyPrefix}.otsikko`)}</ModalHeader>
      <ModalBody>{t(`${errorKeyPrefix}.viesti`)}</ModalBody>
      <ModalFooter>
        <Flex justifyCenter>
          <ModalButton
            marginLeft={1}
            color="danger"
            onClick={() => setErrorCode(null)}
          >
            {t('yleiset.suljeVaroitus')}
          </ModalButton>
          {errorCode === UNAUTHORIZED && (
            <ModalButton
              onClick={() =>
                isDev
                  ? window.open(
                      apiUrls.url('cas.login') +
                        `?service=${encodeURIComponent(
                          'https://localhost:3000/kouta'
                        )}`
                    )
                  : window.location.replace(apiUrls.url('cas.login'))
              }
            >
              {t('yleiset.meneLoginSivulle')}
            </ModalButton>
          )}
        </Flex>
      </ModalFooter>
    </Modal>
  );
}
