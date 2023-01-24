import React, { useCallback, useEffect, useMemo } from 'react';

import { useActor, useInterpret, useSelector } from '@xstate/react';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { ModalMachine } from '#/src/machines/modalMachine';

import { EntityListTable } from './EntitySearchList';

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

export const CopyConfirmationWrapper = ({ entities, children }) => {
  const modalService = useInterpret(ModalMachine);

  useEffect(() => {
    modalService.send({ type: 'SET_ENTITIES', entities });
  }, [entities, modalService]);

  const selectionService = useSelector(
    modalService,
    state => state.context.selectionRef
  );

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
  createColumns: (selectionActor: any) => any;
}) => {
  const { t } = useTranslation();

  const { isOpen, closeModal } = useCopyConfirmationModal();

  const { selectionService } = useContextOrThrow(CopyConfirmationModalContext);

  const columns = useMemo(
    () => createColumns(selectionService),
    [createColumns, selectionService]
  );

  const selection = useModalSelection();

  const onConfirm = useCallback(() => {
    onCopySelection(selection);
    closeModal();
  }, [closeModal, onCopySelection, selection]);

  return (
    <Modal
      minHeight="200px"
      maxWidth="1200px"
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
          <Button disabled={_fp.isEmpty(selection)} onClick={onConfirm}>
            {t('etusivu.aloitaKopiointi')}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
