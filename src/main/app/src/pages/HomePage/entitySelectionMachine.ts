import { assign } from '@xstate/immer';
import _ from 'lodash';
import { createMachine } from 'xstate';

import { JULKAISUTILA } from '#/src/constants';

export type EntityListItem = {
  oid: string;
  nimi?: TranslatedField<string>;
  tila?: JULKAISUTILA;
};

interface SelectionContext {
  selection: Record<string, EntityListItem>;
}

interface SelectItemsEvent {
  type: 'SELECT_ITEMS';
  items: Array<EntityListItem>;
}

interface DeselectItemsEvent {
  type: 'DESELECT_ITEMS';
  items: Array<EntityListItem>;
}

interface ResetSelectionEvent {
  type: 'RESET_SELECTION';
  items?: Array<EntityListItem>;
}

export const entitySelectionMachine = createMachine(
  {
    predictableActionArguments: true,
    id: 'EntitySelectionMachine',
    schema: {
      context: {} as SelectionContext,
      events: {} as SelectItemsEvent | DeselectItemsEvent | ResetSelectionEvent,
    },
    context: {
      selection: {},
    },
    on: {
      SELECT_ITEMS: {
        actions: 'selectItems',
      },
      DESELECT_ITEMS: {
        actions: 'deselectItems',
      },
      RESET_SELECTION: {
        actions: 'resetSelection',
      },
    },
  },
  {
    actions: {
      selectItems: assign<SelectionContext, SelectItemsEvent>((ctx, e) => {
        _.forEach(e.items, item => {
          ctx.selection[item.oid] = item;
        });
      }) as any,
      deselectItems: assign<SelectionContext, DeselectItemsEvent>((ctx, e) => {
        _.forEach(e.items, item => {
          delete ctx.selection[item.oid];
        });
      }) as any,
      resetSelection: assign<SelectionContext, ResetSelectionEvent>(
        (ctx, e) => {
          ctx.selection = {};
          _.forEach(e?.items, item => {
            ctx.selection[item.oid] = item;
          });
        }
      ) as any,
    },
  }
);
