import { actions, createMachine, spawn } from 'xstate';

import { EntitySelectionMachine } from '#/src/pages/HomePage/entitySelectionMachine';

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

interface ModalMachineContext {
  selectionRef: any;
  entities?: EntitySelection;
}

export const ModalMachine = createMachine(
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
      setEntities: assign<ModalMachineContext, any>({
        entities: (ctx, e) => e.entities,
      }),
      selectAll: pure<ModalMachineContext, any>(ctx => {
        return send(
          { type: 'RESET_SELECTION', items: ctx.entities },
          { to: ctx.selectionRef }
        );
      }),
    } as any,
  }
);
