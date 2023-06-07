import React from 'react';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Modal from '#/src/components/Modal';
import {
  Box,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';

const ModalButton = styled(Button)`
  margin-left: 1em;
`;

const DeleteConfirmationDialog = ({ isOpen, name, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal open={isOpen}>
      <ModalHeader>{t('ilmoitukset.luonnoksenPoisto.otsikko')}</ModalHeader>
      <ModalBody>
        {t('ilmoitukset.luonnoksenPoisto.viesti', { name })}
      </ModalBody>
      <ModalFooter>
        <Box display="flex" justifyContent="center">
          <ModalButton color="danger" onClick={onConfirm}>
            {t('ilmoitukset.luonnoksenPoisto.jatka')}
          </ModalButton>
          <ModalButton onClick={onCancel}>
            {t('ilmoitukset.luonnoksenPoisto.peruuta')}
          </ModalButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
