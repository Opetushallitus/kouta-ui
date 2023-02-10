import React, { useCallback, useMemo } from 'react';

import { useInterpret, useSelector } from '@xstate/react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import {
  safeGetJulkaisutilaTranslationKey,
  JULKAISUTILA,
} from '#/src/constants';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { BatchOpsModalMachine } from '#/src/machines/modalMachine';

import { useBatchOpsModal } from './CopyConfirmationModal';
import { EntityListTable } from './EntitySearchList';
import { useEntitySelectionApi } from './useEntitySelection';

export const StateChangeConfirmationModalContext = React.createContext(
  {} as any
);

export const useStateChangeConfirmationModal = () => {
  const { modalService } = useContextOrThrow(
    StateChangeConfirmationModalContext
  );

  return useBatchOpsModal(modalService);
};

export const StateChangeConfirmationWrapper = ({ children }) => {
  const modalService = useInterpret(BatchOpsModalMachine);

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
    <StateChangeConfirmationModalContext.Provider value={modalContext}>
      {children}
    </StateChangeConfirmationModalContext.Provider>
  );
};

export const StateChangeConfirmationModal = ({
  headerText,
  startBatchMutation,
  createColumns,
}: {
  headerText: string;
  startBatchMutation: (x: {
    hakukohteet: Array<string>;
    tila: JULKAISUTILA;
  }) => void;
  createColumns: (selectionActor: any) => any;
}) => {
  const { t } = useTranslation();

  const { tila, isOpen, closeModal, entities } =
    useStateChangeConfirmationModal();

  const { selectionService } = useContextOrThrow(
    StateChangeConfirmationModalContext
  );

  const columns = useMemo(
    () => createColumns(selectionService),
    [createColumns, selectionService]
  );

  const { selection } = useEntitySelectionApi(selectionService);

  const onConfirm = useCallback(() => {
    startBatchMutation({ hakukohteet: selection, tila });
    closeModal();
  }, [closeModal, startBatchMutation, selection, tila]);

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
            {t('etusivu.hakukohde.vahvistaTilanmuutos', {
              tila: t(safeGetJulkaisutilaTranslationKey(tila)),
            })}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
