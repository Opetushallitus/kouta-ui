import React, { useCallback, useEffect, useMemo } from 'react';

import { useActor, useInterpret, useSelector } from '@xstate/react';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { createMachine, spawn, actions } from 'xstate';

import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';

import { EntityListTable } from './EntitySearchList';
import { EntitySelectionMachine } from './entitySelectionMachine';

const { pure, assign, send } = actions;

interface OpenEvent {
  type: 'OPEN';
}

interface CloseEvent {
  type: 'CLOSE';
}

type EntitySelection = Record<string, Record<string, any>>;

interface SetEntitiesEvent {
  type: 'SET_ENTITIES';
  entities: EntitySelection;
}

interface CopyConfirmationMachineContext {
  selectionRef: any;
  entities?: EntitySelection;
}

export const CopyConfirmationModalMachine = createMachine(
  {
    schema: {
      events: {} as OpenEvent | CloseEvent | SetEntitiesEvent,
      context: {
        entities: {} as EntitySelection,
        selectionRef: null as any,
      },
    },
    context: {
      entities: {}, // Kaikki valittavissa olevat entiteetit
      selectionRef: null,
    },
    initial: 'initializing',
    states: {
      initializing: {
        entry: assign({
          selectionRef: () => spawn(EntitySelectionMachine),
        }),
        always: {
          target: 'closed',
        },
      },
      open: {
        entry: 'selectAll',
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
    on: {
      SET_ENTITIES: {
        actions: 'setEntities',
      },
    },
  },
  {
    actions: {
      setEntities: assign<CopyConfirmationMachineContext, any>({
        entities: (ctx, e) => e.entities,
      }),
      selectAll: pure<CopyConfirmationMachineContext, any>(ctx => {
        return send(
          { type: 'RESET_SELECTION', items: ctx.entities },
          { to: ctx.selectionRef }
        );
      }),
    } as any,
  }
);

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
  const modalService = useInterpret(CopyConfirmationModalMachine);

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
