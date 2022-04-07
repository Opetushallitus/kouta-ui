import React, { useCallback, useEffect, useMemo } from 'react';

import { useActor, useInterpret, useSelector } from '@xstate/react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { createMachine } from 'xstate';

import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';

import { EntityListTable } from './EntitySearchList';
import { EntitySelectionMachine } from './entitySelectionMachine';

interface OpenEvent {
  type: 'OPEN';
}

interface CloseEvent {
  type: 'CLOSE';
}

export const CopyConfirmationModalMachine = createMachine({
  schema: {
    events: {} as OpenEvent | CloseEvent,
  },
  initial: 'closed',
  states: {
    open: {
      on: {
        CLOSE: 'closed',
      },
    },
    closed: {
      on: {
        OPEN: 'open',
      },
    },
  },
});

export const CopyConfirmationModalContext = React.createContext({} as any);

export const useCopyConfirmationModal = () => {
  const { modalService } = useContextOrThrow(CopyConfirmationModalContext);

  const [state, send] = useActor(modalService);

  return useMemo(
    () => ({
      isOpen: state.value === 'open',
      openModal: () => send('OPEN'),
      closeModal: () => send('CLOSE'),
    }),
    [state, send]
  );
};

export const useModalSelection = () => {
  const { selectionService } = useContextOrThrow(CopyConfirmationModalContext);

  return useSelector(selectionService, state => state.context.selection);
};

export const CopyConfirmationWrapper = ({ children }) => {
  const selectionService = useInterpret(EntitySelectionMachine as any);
  const modalService = useInterpret(CopyConfirmationModalMachine as any);

  const modalContext = useMemo(
    () => ({
      modalService,
      selectionService,
    }),
    [modalService, selectionService]
  );

  return (
    <CopyConfirmationModalContext.Provider value={modalContext}>
      {children}
    </CopyConfirmationModalContext.Provider>
  );
};

export const CopyConfirmationModal = ({
  headerText,
  entities = [],
  onCopySelection,
  createColumns,
}: {
  headerText: string;
  entities: Array<any>;
  onCopySelection: any;
  createColumns: (
    t: TFunction,
    organisatioOid: string,
    selectionActor: any
  ) => any;
}) => {
  const { t } = useTranslation();

  const { isOpen, closeModal } = useCopyConfirmationModal();

  const { selectionService, modalService } = useContextOrThrow(
    CopyConfirmationModalContext
  );

  const selectedOrganisaatioOid = useSelectedOrganisaatioOid();

  const columns = useMemo(
    () => createColumns(t, selectedOrganisaatioOid, selectionService),
    [t, createColumns, selectedOrganisaatioOid, selectionService]
  );

  const selection = useModalSelection();

  useEffect(() => {
    const subscription = modalService.subscribe(state => {
      if (state.changed && state.value === 'open') {
        selectionService.send({ type: 'SELECT_ITEMS', items: entities });
      }
    });
    return subscription.unsubscribe;
  }, [modalService, selectionService, entities]);

  const onConfirm = useCallback(() => {
    onCopySelection(selection);
    closeModal();
  }, [closeModal, onCopySelection, selection]);

  return (
    <Modal
      minHeight="90vh"
      style={{ maxWidth: '1200px', width: '90vw' }}
      open={isOpen}
      onClose={closeModal}
      header={headerText}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="outlined" onClick={closeModal}>
              {t('yleiset.sulje')}
            </Button>
          </Box>
          <Button onClick={onConfirm}>{t('yleiset.aloitaKopiointi')}</Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
