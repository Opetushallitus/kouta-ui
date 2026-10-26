import { flow, fromPairs, reject, size, toPairs } from 'lodash-es';
import { assign, fromPromise, sendTo, setup, type ActorRefFrom } from 'xstate';

import { JULKAISUTILA } from '#/src/constants';
import { entitySelectionMachine } from '#/src/pages/HomePage/entitySelectionMachine';

export interface StartEvent {
  type: 'START';
  tila?: JULKAISUTILA;
  entities: EntitySelection;
}

export interface ExecuteEvent {
  type: 'EXECUTE';
  tila?: JULKAISUTILA;
  entities: EntitySelection;
}

interface CloseEvent {
  type: 'CLOSE';
}
interface CancelEvent {
  type: 'CANCEL';
}

type EntityItem = { oid: string; tila?: JULKAISUTILA };

export type EntitySelection = Record<string, EntityItem>;

type BatchOperationResponseItem = {
  oid: string;
  status: 'success' | 'error';
};

type BatchOperationResponseData = Array<BatchOperationResponseItem>;

interface BatchOpsMachineContext {
  result?: BatchOperationResponseData;
  tila?: JULKAISUTILA;
  entities: EntitySelection;
  selectionRef?: ActorRefFrom<typeof entitySelectionMachine>;
}

type BatchOpsMachineEvent =
  | StartEvent
  | ExecuteEvent
  | CancelEvent
  | CloseEvent;

const machineSetup = setup({
  types: {
    context: {} as BatchOpsMachineContext,
    events: {} as BatchOpsMachineEvent,
  },
  actors: {
    runMutation: fromPromise<BatchOperationResponseData, ExecuteEvent>(() => {
      throw new Error('runMutation actor must be provided via .provide()');
    }),
  },
  guards: {
    eventHasEntities: ({ event }) => {
      const e = event as StartEvent;
      return size(reject(e?.entities, { tila: e?.tila })) > 0;
    },
  },
});

export const BatchOpsMachine = machineSetup.createMachine({
  id: 'BatchOpsMachine',
  context: {
    tila: undefined, // Tila, joka halutaan asettaa kaikille entiteeteille (massa-tilamuutos)
    entities: {}, // Kaikki valittavissa olevat entiteetit
    selectionRef: undefined,
    result: undefined,
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: machineSetup.assign({
        selectionRef: ({ spawn }) => spawn(entitySelectionMachine),
      }),
      always: 'initial',
    },
    initial: {
      entry: machineSetup.assign(() => ({
        entities: {},
        tila: undefined,
        result: undefined,
      })),
      on: {
        START: {
          guard: 'eventHasEntities',
          target: 'confirming',
          actions: machineSetup.assign(({ context, event }) => {
            const e = event as StartEvent;
            return {
              tila: e?.tila ?? context.tila,
              entities: e?.entities
                ? flow(
                    t => toPairs<EntityItem>(t),
                    entities =>
                      reject(entities, ([, v]) => v?.tila === e?.tila),
                    fromPairs
                  )(e?.entities)
                : context.entities,
            };
          }),
        },
      },
    },
    confirming: {
      entry: sendTo(
        ({ context }) => context.selectionRef!,
        ({ context }) =>
          ({
            type: 'RESET_SELECTION',
            items: context.entities,
          }) as any
      ),
      on: {
        EXECUTE: 'executing',
        CANCEL: 'initial',
      },
    },
    executing: {
      invoke: {
        id: 'runMutation',
        src: 'runMutation',
        input: ({ event }) => event as ExecuteEvent,
        onDone: {
          target: 'result.success',
          actions: assign({
            result: ({ event }) => event.output,
          }),
        },
        onError: 'result.error',
      },
    },
    result: {
      initial: 'success',
      states: {
        success: {},
        error: {},
      },
      on: {
        CLOSE: 'initial',
      },
    },
  },
});
