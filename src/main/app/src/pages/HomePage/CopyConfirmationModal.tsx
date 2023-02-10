import React, { useCallback, useMemo } from 'react';

import { useActor, useInterpret, useSelector } from '@xstate/react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { BatchOpsModalMachine } from '#/src/machines/modalMachine';
import { isDev } from '#/src/utils';

import { EntityListTable } from './EntitySearchList';
import { useEntitySelectionApi } from './useEntitySelection';

export const CopyConfirmationModalContext = React.createContext({} as any);

export const useBatchOpsModal = modalService => {
  const [state, send] = useActor(modalService);

  const tila = useSelector(modalService, s => s.context?.tila);
  const entities = useSelector(modalService, s => s.context?.entities);

  return useMemo(
    () => ({
      tila,
      entities,
      isOpen: state.value === 'open',
      openModal: ({ tila, entities }) => send({ type: 'OPEN', tila, entities }),
      closeModal: () => send('CLOSE'),
    }),
    [state, send, tila, entities]
  );
};

export const useCopyConfirmationModal = () => {
  const { modalService } = useContextOrThrow(CopyConfirmationModalContext);
  return useBatchOpsModal(modalService);
};

export const CopyConfirmationWrapper = ({ children }) => {
  const modalService = useInterpret(BatchOpsModalMachine, { devTools: isDev });

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
  onCopySelection,
  createColumns,
}: {
  headerText: string;
  onCopySelection: any;
  createColumns: (selectionActor: any) => any;
}) => {
  const { t } = useTranslation();

  const { isOpen, closeModal, entities } = useCopyConfirmationModal();

  const { selectionService } = useContextOrThrow(CopyConfirmationModalContext);

  const columns = useMemo(
    () => createColumns(selectionService),
    [createColumns, selectionService]
  );

  const { selection } = useEntitySelectionApi(selectionService);

  const onConfirm = useCallback(() => {
    onCopySelection({ entities: selection });
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
          <Button disabled={_.isEmpty(selection)} onClick={onConfirm}>
            {t('etusivu.aloitaKopiointi')}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
