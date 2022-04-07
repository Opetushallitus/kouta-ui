import { useCallback } from 'react';

import { useActor, useSelector } from '@xstate/react';
import { interpret } from 'xstate';

import { ENTITY } from '#/src/constants';

import { EntitySelectionMachine } from './entitySelectionMachine';

export const SERVICE_BY_ENTITY = {
  [ENTITY.TOTEUTUS]: interpret(EntitySelectionMachine).start(),
};

export const useEntitySelectionApi = actor => {
  const [, send] = useActor(actor);

  const selection = useSelector(actor, state => state.context.selection);

  return {
    selection,
    selectItems: useCallback(
      items => send({ type: 'SELECT_ITEMS', items }),
      [send]
    ),
    deselectItems: useCallback(
      items => send({ type: 'DESELECT_ITEMS', items }),
      [send]
    ),
    removeSelection: useCallback(() => send({ type: 'DESELECT_ALL' }), [send]),
  };
};

export const useEntitySelection = entityType =>
  useEntitySelectionApi(SERVICE_BY_ENTITY[entityType]);
