import React from 'react';

import { StatusCodes } from 'http-status-codes';
import styled from 'styled-components';

import Modal from '#/src/components/Modal';
import {
  Box,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';
import {
  ERROR_INTERNET_DISCONNECTED,
  ERROR_KAYTTOOIKEUS_SERVICE,
} from '#/src/constants';

const ModalButton = styled(Button)`
  margin-left: 1em;
`;

const getErrorTranslationKeyPrefix = (code: string | number) => {
  switch (code) {
    case StatusCodes.UNAUTHORIZED:
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
        <Box display="flex" justifyContent="center">
          <ModalButton color="danger" onClick={() => setErrorCode(null)}>
            {t('yleiset.suljeVaroitus')}
          </ModalButton>
          {errorCode === StatusCodes.UNAUTHORIZED && (
            <ModalButton
              onClick={() =>
                window.location.replace(
                  apiUrls.url('cas.login') +
                    '?service=' +
                    encodeURIComponent(window.location.href)
                )
              }
            >
              {t('yleiset.meneLoginSivulle')}
            </ModalButton>
          )}
        </Box>
      </ModalFooter>
    </Modal>
  );
}
