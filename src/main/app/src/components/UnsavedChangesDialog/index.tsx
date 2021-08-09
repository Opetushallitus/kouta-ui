import React from 'react';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import Modal from '#/src/components/Modal';
import {
  Box,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '#/src/components/virkailija';

const ModalButton = styled(Button)`
  margin-left: 1em;
`;

const UnsavedChangesDialog = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal open={true}>
      <ModalHeader>
        {t('ilmoitukset.tallentamattomiaMuutoksia.otsikko')}
      </ModalHeader>
      <ModalBody>{t('ilmoitukset.tallentamattomiaMuutoksia.viesti')}</ModalBody>
      <ModalFooter>
        <Box display="flex" justifyContent="center">
          <ModalButton color="danger" onClick={onConfirm}>
            {t('ilmoitukset.tallentamattomiaMuutoksia.jatka')}
          </ModalButton>
          <ModalButton onClick={onCancel}>
            {t('ilmoitukset.tallentamattomiaMuutoksia.peruuta')}
          </ModalButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default UnsavedChangesDialog;
