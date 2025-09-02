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

const DeleteConfirmationDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  headerText,
  message,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  headerText: string;
  message: string;
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={isOpen}>
      <ModalHeader>{headerText}</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Box display="flex" justifyContent="center">
          <ModalButton color="danger" onClick={onConfirm}>
            {t('ilmoitukset.jatka')}
          </ModalButton>
          <ModalButton onClick={onCancel}>
            {t('ilmoitukset.peruuta')}
          </ModalButton>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
