import React from 'react';
import styled from 'styled-components';
import { UNAUTHORIZED } from 'http-status-codes';
import Modal from '#/src/components/Modal';
import ModalHeader from '#/src/components/ModalHeader';
import ModalBody from '#/src/components/ModalBody';
import ModalFooter from '#/src/components/ModalFooter';
import Button from '#/src/components/Button';
import Flex from '#/src/components/Flex';
import { isDev } from '#/src/utils';

const ModalButton = styled(Button)`
  margin-left: 1em;
`;

export default function SessionErrorModal({
  sessionErrorCode,
  setSessionErrorCode,
  apiUrls,
  t,
}) {
  return (
    <Modal open={sessionErrorCode}>
      <ModalHeader>
        {sessionErrorCode === UNAUTHORIZED
          ? t('ilmoitukset.istuntoVirhe.otsikko')
          : t('ilmoitukset.yhteysVirhe.otsikko')}
      </ModalHeader>
      <ModalBody>
        {sessionErrorCode === UNAUTHORIZED
          ? t('ilmoitukset.istuntoVirhe.viesti')
          : t('ilmoitukset.yhteysVirhe.viesti')}
      </ModalBody>
      <ModalFooter>
        <Flex justifyCenter>
          <ModalButton
            marginLeft={1}
            color="danger"
            onClick={() => setSessionErrorCode(null)}
          >
            {t('yleiset.suljeVaroitus')}
          </ModalButton>
          {sessionErrorCode === UNAUTHORIZED && (
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
