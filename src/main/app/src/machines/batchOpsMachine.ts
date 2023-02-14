import _ from 'lodash';
import { actions, createMachine, spawn } from 'xstate';

import { JULKAISUTILA } from '#/src/constants';
import { EntitySelectionMachine } from '#/src/pages/HomePage/entitySelectionMachine';

const { pure, assign, send } = actions;

interface StartEvent {
  type: 'START';
}

interface ExecuteEvent {
  type: 'EXECUTE';
}

interface CloseEvent {
  type: 'CLOSE';
}
interface CancelEvent {
  type: 'CANCEL';
}

type EntitySelection = Record<string, Record<string, any>>;

interface BatchOpsMachineContext {
  result?: any;
  error?: string;
  tila?: JULKAISUTILA;
  entities?: EntitySelection;
  selectionRef: any;
  mutation?: any;
}

export const BatchOpsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAXAxgCwPIAdYBZVHASwDswA6Ss9M1AGzIC9KoBiAbQAYBdRKHwB7WPTIiKQkAA9EAZgAsAVmoAmFQBoQAT0QA2dQE4AvqZ1oseQiXJVaEJmE4BlACoBBAEru+gpBBRcQYpGXkEE2NqAHYARgAOGO09QwSE6hVzSwwcAmJSbEoaTCkAMzIAJwBbDk4AUQANeoBhAFV3ev8ZYIkwwIj1GKVqJRMDJJT9BBjjA0yjLIsQKzzbQuLqUooKmrqWzwA5FvqAGW7A3tDpAcQhkbG5yZ1phJVo3kXsldybAvsaGBZGBMABXBgULgQKQ0SgANxEAGsaJVQRQiOCMJIKBdhGI+jdQBEFAk4pljApki9EG8Pl9lqs-nYig4gSDwXUwJVKiJKtR8EwMGVedVqKj0ZjrrigvjruFFKTyZSpog5iM4ppvoz8szNpU4KCmOhOC1TrhXF0BD1ZdiZNNxpkdBEVCp1OZlhQRBA4DJtesAdaQrbbggALRKBLUyK8DLGONx0lxJS8FTxN0M346jYOOgMZhsDiBgnyhC8KNKBTpnLWLMAxzOItykNl1IIAxxBSZLWZ-0skrlKq1SGN4NExAt6azJbVtb-PvUNlgiFQEf9MelqPGGLzac-Gu9vUGo2rwlyRARqMO3d+ueH2CG9DUe+YTBweCXG1rs8IOZRklKbt91vBx9XvI0F25XkTxLX9WxURIu3dIA */
  createMachine(
    {
      id: 'BatchOpsMachine',
      schema: {
        events: {} as StartEvent | ExecuteEvent | CancelEvent | CloseEvent,
        context: {} as BatchOpsMachineContext,
      },
      context: {
        tila: undefined, // Tila, joka halutaan asettaa kaikille entiteeteille (massa-tilamuutos)
        entities: {}, // Kaikki valittavissa olevat entiteetit
        selectionRef: undefined,
        mutation: undefined,
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
              actions: assign({
                result: (ctx, e) => {
                  return e.data;
                },
              }),
            },
            onError: {
              actions: [
                assign({
                  error: (ctx, e) => {
                    return e.data;
                  },
                }),
              ],
              target: 'result.error',
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
              actions: ['resetMutation'],
            },
          },
        },
      },
    },
    {
      actions: {
        setContext: assign<BatchOpsMachineContext, any>({
          tila: (ctx, e) => e?.tila ?? ctx.tila,
          entities: (ctx, e) =>
            e?.entities
              ? _.reject(e?.entities, { tila: e?.tila })
              : ctx.entities,
        }),
        resetMutation: ctx => {
          ctx.mutation.reset();
        },
        resetContext: assign({
          entities: () => ({}),
          tila: undefined,
        }),
        initSelectionMachine: assign({
          selectionRef: () => spawn(EntitySelectionMachine),
        }),
        selectAll: pure<BatchOpsMachineContext, any>(ctx => {
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
        eventHasEntities: (ctx, e) => {
          return _.size(_.reject(e?.entities, { tila: e?.tila })) > 0;
        },
      },
      services: {
        runMutation: (ctx, e) => {
          return ctx.mutation.mutateAsync(e);
        },
      },
    }
  );
