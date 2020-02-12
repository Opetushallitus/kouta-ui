import React from 'react';
import styled from 'styled-components';
import { UNAUTHORIZED } from 'http-status-codes';
import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import ModalFooter from '../ModalFooter';
import Button from '../Button';
import Flex from '../Flex';
import { isDev } from '../../utils';

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
                  ? window.open(apiUrls.url('cas.login'))
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
