import { assign } from '@xstate/immer';
import _ from 'lodash';
import { createMachine } from 'xstate';

type EntityListItem = {
  oid: string;
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
    id: 'EntitySelectionMachine',
    tsTypes: {} as import('./entitySelectionMachine.typegen').Typegen0,
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
      }),
      deselectItems: assign<SelectionContext, DeselectItemsEvent>((ctx, e) => {
        _.forEach(e.items, item => {
          delete ctx.selection[item.oid];
        });
      }),
      resetSelection: assign<SelectionContext, ResetSelectionEvent>(
        (ctx, e) => {
          ctx.selection = {};
          _.forEach(e?.items, item => {
            ctx.selection[item.oid] = item;
          });
        }
      ),
    },
  }
);
