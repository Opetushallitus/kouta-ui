import { produce } from 'immer';
import { forEach } from 'lodash-es';
import { setup } from 'xstate';

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

type EntitySelectionEvent =
  SelectItemsEvent | DeselectItemsEvent | ResetSelectionEvent;

const machineSetup = setup({
  types: {
    context: {} as SelectionContext,
    events: {} as EntitySelectionEvent,
  },
});

export const entitySelectionMachine = machineSetup.createMachine({
  id: 'EntitySelectionMachine',
  context: {
    selection: {},
  },
  on: {
    SELECT_ITEMS: {
      actions: machineSetup.assign(({ context, event }) =>
        produce(context, draft => {
          forEach((event as SelectItemsEvent).items, item => {
            draft.selection[item.oid] = item;
          });
        })
      ),
    },
    DESELECT_ITEMS: {
      actions: machineSetup.assign(({ context, event }) =>
        produce(context, draft => {
          forEach((event as DeselectItemsEvent).items, item => {
            delete draft.selection[item.oid];
          });
        })
      ),
    },
    RESET_SELECTION: {
      actions: machineSetup.assign(({ context, event }) =>
        produce(context, draft => {
          draft.selection = {};
          forEach((event as ResetSelectionEvent)?.items, item => {
            draft.selection[item.oid] = item;
          });
        })
      ),
    },
  },
});
