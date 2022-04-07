import { assign } from '@xstate/immer';
import _fp from 'lodash/fp';
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

interface DeselectAllEvent {
  type: 'DESELECT_ALL';
}

export const EntitySelectionMachine = createMachine(
  {
    schema: {
      context: {} as SelectionContext,
      events: {} as SelectItemsEvent | DeselectItemsEvent | DeselectAllEvent,
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
      DESELECT_ALL: {
        actions: 'deselectAll',
      },
    },
  },
  {
    actions: {
      selectItems: assign<SelectionContext, SelectItemsEvent>((ctx, e) => {
        _fp.forEach(item => {
          ctx.selection[item.oid] = item;
        }, e.items);
      }),
      deselectItems: assign<SelectionContext, DeselectItemsEvent>((ctx, e) =>
        _fp.forEach(item => {
          delete ctx.selection[item.oid];
        }, e.items)
      ),
      deselectAll: assign<SelectionContext, DeselectAllEvent>(ctx => {
        ctx.selection = {};
      }),
    } as any,
  }
);
