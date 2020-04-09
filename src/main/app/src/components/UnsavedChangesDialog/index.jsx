import Modal from '#/src/components/Modal';
import ModalHeader from '@opetushallitus/virkailija-ui-components/ModalHeader';
import ModalBody from '@opetushallitus/virkailija-ui-components/ModalBody';
import ModalFooter from '@opetushallitus/virkailija-ui-components/ModalFooter';
import Flex from '#/src/components/Flex';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Button from '@opetushallitus/virkailija-ui-components/Button';

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
        <Flex justifyCenter>
          <ModalButton marginLeft={1} color="danger" onClick={onConfirm}>
            {t('ilmoitukset.tallentamattomiaMuutoksia.jatka')}
          </ModalButton>
          <ModalButton onClick={onCancel}>
            {t('ilmoitukset.tallentamattomiaMuutoksia.peruuta')}
          </ModalButton>
        </Flex>
      </ModalFooter>
    </Modal>
  );
};

export default UnsavedChangesDialog;
