import React, { useCallback, useEffect, useMemo } from 'react';

import { useActor, useInterpret, useSelector } from '@xstate/react';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { createMachine, spawn, actions } from 'xstate';

import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { useHakukohdeTila } from '#/src/pages/HomePage/HakukohteetSection';

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

interface StateChangeConfirmationMachineContext {
  selectionRef: any;
  entities?: EntitySelection;
}

export const StateChangeConfirmationModalMachine = createMachine(
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
      setEntities: assign<StateChangeConfirmationMachineContext, any>({
        entities: (ctx, e) => e.entities,
      }),
      selectAll: pure<StateChangeConfirmationMachineContext, any>(ctx => {
        return send(
          { type: 'RESET_SELECTION', items: ctx.entities },
          { to: ctx.selectionRef }
        );
      }),
    } as any,
  }
);

export const StateChangeConfirmationModalContext = React.createContext(
  {} as any
);

export const useStateChangeConfirmationModal = () => {
  const { modalService } = useContextOrThrow(
    StateChangeConfirmationModalContext
  );

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

export const useFilteredModalSelection = () => {
  const { selectionService } = useContextOrThrow(
    StateChangeConfirmationModalContext
  );

  const selection = useSelector(
    selectionService,
    state => state.context.selection
  );

  const { tila } = useHakukohdeTila();

  const tilaFilteredSelection = Object.values(selection).filter(
    hakukohde => hakukohde?.tila !== tila?.value
  );

  return tilaFilteredSelection;
};

export const StateChangeConfirmationWrapper = ({ entities, children }) => {
  const modalService = useInterpret(StateChangeConfirmationModalMachine);

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
    <StateChangeConfirmationModalContext.Provider value={modalContext}>
      {children}
    </StateChangeConfirmationModalContext.Provider>
  );
};

export const StateChangeConfirmationModal = ({
  headerText,
  onStateChangeSelection,
  createColumns,
}: {
  headerText: string;
  onStateChangeSelection: any;
  createColumns: (selectionActor: any) => any;
}) => {
  const { t } = useTranslation();

  const { isOpen, closeModal } = useStateChangeConfirmationModal();

  const { selectionService } = useContextOrThrow(
    StateChangeConfirmationModalContext
  );

  const columns = useMemo(
    () => createColumns(selectionService),
    [createColumns, selectionService]
  );

  const selection = useFilteredModalSelection();

  const { tila } = useHakukohdeTila();

  const onConfirm = useCallback(() => {
    onStateChangeSelection(selection);
    closeModal();
  }, [closeModal, onStateChangeSelection, selection]);

  const tilaLabel = tila?.label || '';

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
            {t('etusivu.hakukohde.vahvistaTilanmuutos', {
              tila: tilaLabel,
            })}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={selection} columns={columns} />
    </Modal>
  );
};
