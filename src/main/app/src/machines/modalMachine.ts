import _ from 'lodash';
import { actions, createMachine, spawn } from 'xstate';

import { JULKAISUTILA } from '#/src/constants';
import { EntitySelectionMachine } from '#/src/pages/HomePage/entitySelectionMachine';

const { pure, assign, send } = actions;

interface OpenEvent {
  type: 'OPEN';
  entities: EntitySelection;
  tila?: JULKAISUTILA;
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
  tila?: JULKAISUTILA;
  entities?: EntitySelection;
  selectionRef: any;
}

export const BatchOpsModalMachine = createMachine(
  {
    id: 'BatchOpsModalMachine',
    schema: {
      events: {} as OpenEvent | CloseEvent | SetEntitiesEvent,
      context: {} as ModalMachineContext,
    },
    context: {
      tila: undefined, // Tila, joka halutaan asettaa kaikille entiteeteille (massa-tilamuutos)
      entities: {}, // Kaikki valittavissa olevat entiteetit
      selectionRef: undefined,
    },
    initial: 'initializing',
    states: {
      initializing: {
        entry: 'initSelectionMachine',
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
          OPEN: {
            target: 'open',
            cond: 'hasItems',
            actions: ['setContext'],
          },
        },
      },
    },
  },
  {
    actions: {
      setContext: assign<ModalMachineContext, any>({
        tila: (ctx, e) => e?.tila ?? ctx.tila,
        entities: (ctx, e) =>
          e?.entities ? _.reject(e?.entities, { tila: e?.tila }) : ctx.entities,
      }),
      resetContext: assign({
        entities: () => ({}),
      }),
      initSelectionMachine: assign({
        selectionRef: () => spawn(EntitySelectionMachine),
      }),
      selectAll: pure<ModalMachineContext, any>(ctx => {
        return send(
          {
            type: 'RESET_SELECTION',
            items: ctx?.entities,
          },
          { to: ctx.selectionRef }
        );
      }),
    } as any, // https://github.com/statelyai/xstate/issues/1198
    guards: {
      hasItems: (ctx, e) => {
        return _.size(_.reject(e?.entities, { tila: e?.tila })) > 0;
      },
    },
  }
);
