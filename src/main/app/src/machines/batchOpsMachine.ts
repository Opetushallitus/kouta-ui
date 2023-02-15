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

type EntitySelection = Record<string, EntityItem>;

type BatchOperationResponseItem = {
  oid: string;
  status: 'success' | 'error';
};

type BatchOperationResponseData = Array<BatchOperationResponseItem>;

interface BatchOpsMachineContext {
  result?: BatchOperationResponseData;
  error?: unknown;
  tila?: JULKAISUTILA;
  entities: EntitySelection;
  selectionRef?: ActorRefFrom<typeof entitySelectionMachine>;
}

export const BatchOpsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAXAxgCwPIAdYBZVHASwDswA6Ss9M1AGzIC9KoBiAbQAYBdRKHwB7WPTIiKQkAA9EAdgAc1AMwA2BQEYlCgKwAaEAE9Ee1QE4161QCYlW23oC+zo2ix5CJclVoQmME4AZQAVAEEAJVC+QSQQUXEGKRl5BFU1JU0dfSNTBAUAFgy9CwV1PXUnV3cMHAJiUmxKGkwpADMyACcAWw5OAFEADQGAYQBVUIHYmUSJFPi0vULbai11Xi1KpzzEC1UtagVeA+q3EA967yaW6jaKTt7+0fCAOVGBgBkZ+Lnk6UWiFsRWoKws6l0hhMiCUpWovCqLnOly8jV8NDAsjAmAArgwKFwIFIaJQAG4iADWNC6OIoRDxGEkFB+wjE8wBoCWlmoej0vGUjih+UK+nhiJqFzqqJ8zT8mOxeP6YC6XREXWo+CYGHaap61BpdIZ-xZCTZ-1SiHUhUO2khu3SdiOSgsCLOtU8DRlty6cBxTHQnFGn1wwWmAlmZqZFvS61BSiU9kF9t5hy24olFBEEDgMhRnpuVAjSSjgIQAFoLHojvyTknoQgtKLCoVzIKJXnrujaBQJMw2Bwi+zo2WRdXjqchYhCrwq+pNODIe2pfmu2QAmBB+bSxZDrYtLx9rl6xt1Dzx23kcvO7LWh1un0CZuS5zEKpCmttpOEFkrDP+Q43UlD1r1ueVcXxKAnwWF8ED0Wx32WWwFyPfIFA0agylsCp03dK40RvfVfX9KCOTkIEVh5Odp0Re0sNWCwWwnJdgPw70iPQahYBxTBMDgeBfkjaCyIQJDeEoq1XS-YoqyUOxa0AjtWL8H0uP9ahlVVLoSOjUTxOonZ61UPlQUYi9XCAA */
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
        error: undefined,
      },
      initial: 'initializing',
      states: {
        initializing: {
          entry: 'initSelectionMachine',
          always: 'idle',
        },
        idle: {
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
            EXECUTE: {
              target: 'executing',
            },
            CANCEL: {
              target: 'idle',
            },
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
            onError: {
              target: 'result.error',
              actions: 'setError',
            },
          },
        },
        result: {
          states: {
            success: {},
            error: {},
          },
          on: {
            CLOSE: {
              target: 'idle',
            },
          },
        },
      },
    },
    {
      actions: {
        setResult: assign({
          result: (ctx, e) => {
            return e.data;
          },
        }),
        setError: assign({
          error: (ctx, e) => {
            return e.data;
          },
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
        resetContext: assign(ctx => ({
          entities: {},
          tila: undefined,
          result: undefined,
          error: undefined,
        })),
        initSelectionMachine: assign({
          selectionRef: ctx => spawn(entitySelectionMachine),
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
