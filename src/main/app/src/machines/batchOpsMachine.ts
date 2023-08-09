import _ from 'lodash';
import { actions, ActorRefFrom, createMachine, spawn } from 'xstate';

import { JULKAISUTILA } from '#/src/constants';
import { entitySelectionMachine } from '#/src/pages/HomePage/entitySelectionMachine';

const { pure, assign, send } = actions;

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

export const BatchOpsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAXAxgCwPIAdYBZVHASwDswA6Ss9M1AGzIC9KoBiAbQAYBdRKHwB7WPTIiKQkAA9EAdgAc1AMwA2BQEYlCgKwAaEAE9Ee1QE4161QCYlW23oC+zo2ix5CJclVoUJZk4AZQAVAEEAJVC+QSQQUXEGKRl5BFU1JU0dfSNTBAUAFgy9CwV1PXUnV3cMHAJiUmxKGkwpADMyACcAWw5OAFEADQGAYQBVUIHYmUSJFPi0vULbai11Xi1KpzzEC1UtagVeA+q3EA967yaW6jaKTt7+0fCAOVGBgBkZ+Lnk6UWiFsRWoKws6l0hhMiCUpWovCqLnOly8jV8NDAsjAmAArgwKFwIFIaJQAG4iADWNC6OIoRDxGEkFB+wjE8wBoCWlmoej0vGUjih+UK+nhiJqFzqqJ8zT8mOxeP6YC6XREXWo+CYGHaap61BpdIZ-xZCTZ-1SiHUhUO2khu3SdiOSgsCLOtU8DRlty6cBxTHQnFGn1wwWmAlmZqZFvS61BSiU9kF9t5hy24olFBEEDgMhRnpuVAjSSjgIQAFoLHojvyTknoQgtKLCoVzIKJXnruj-IEWOwCUX2dGyyLq8dTkLEIVeFX1JpwZD21L8126AxmAPzaXK9Rwbx9rl6xsMgpVMV9IuPZ3Za0Ot0+v3fpGFpzEKe1tsJwgslZp-yHG7JUvNFr2oeVcXxKANxLF8ED0WxCh5MEIQPfIT3UHcFFsCp03dK5gO9X1-Sg585CBFYeVnKdEXtLDVgsFtxwvPCvT8H1YD9dBqHYzBMDgeBH2LEi0lsF0KKtV1P2KKslDsWsAI7fDWMIzjlVVLpiI5UiEBE3gxKonZ61UPlQQYttXGcIA */
  createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import('./batchOpsMachine.typegen').Typegen0,

      id: 'BatchOpsMachine',
      schema: {
        events: {} as StartEvent | ExecuteEvent | CancelEvent | CloseEvent,
        context: {} as BatchOpsMachineContext,
        services: {} as {
          runMutation: {
            data: BatchOperationResponseData;
          };
        },
      },
      context: {
        tila: undefined, // Tila, joka halutaan asettaa kaikille entiteeteille (massa-tilamuutos)
        entities: {}, // Kaikki valittavissa olevat entiteetit
        selectionRef: undefined,
        result: undefined,
      },
      initial: 'initializing',
      states: {
        initializing: {
          entry: 'initSelectionMachine',
          always: 'initial',
        },
        initial: {
          entry: 'resetContext',
          on: {
            START: {
              cond: 'eventHasEntities',
              target: 'confirming',
              actions: 'setContext',
            },
          },
        },
        confirming: {
          entry: 'selectAll',
          on: {
            EXECUTE: 'executing',
            CANCEL: 'initial',
          },
        },
        executing: {
          invoke: {
            id: 'runMutation',
            src: 'runMutation',
            onDone: {
              target: 'result.success',
              actions: 'setResult',
            },
            onError: 'result.error',
          },
        },
        result: {
          states: {
            success: {},
            error: {},
          },
          on: {
            CLOSE: 'initial',
          },
        },
      },
    },
    {
      actions: {
        setResult: assign({
          result: (ctx, e) => e.data,
        }),
        setContext: assign((ctx, e) => ({
          tila: e?.tila ?? ctx.tila,
          entities: e?.entities
            ? _.flow(
                t => _.toPairs<EntityItem>(t),
                entities => _.reject(entities, ([, v]) => v?.tila === e?.tila),
                _.fromPairs
              )(e?.entities)
            : ctx.entities,
        })),
        resetContext: assign(() => ({
          entities: {},
          tila: undefined,
          result: undefined,
        })),
        initSelectionMachine: assign({
          selectionRef: () => spawn(entitySelectionMachine),
        }),
        selectAll: pure(ctx => {
          return send(
            {
              type: 'RESET_SELECTION',
              items: ctx?.entities,
            },
            { to: ctx.selectionRef }
          );
        }),
      },
      guards: {
        eventHasEntities: (ctx, e) => {
          return _.size(_.reject(e?.entities, { tila: e?.tila })) > 0;
        },
      },
    }
  );
