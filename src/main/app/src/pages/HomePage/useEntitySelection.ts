import { useCallback } from 'react';

import { useActor, useSelector } from '@xstate/react';
import { interpret } from 'xstate';

import { ENTITY } from '#/src/constants';
import { isDev } from '#/src/utils';

import { EntitySelectionMachine } from './entitySelectionMachine';

export const SERVICE_BY_ENTITY = {
  [ENTITY.TOTEUTUS]: interpret(EntitySelectionMachine, {
    devTools: isDev,
  }).start(),
  [ENTITY.HAKUKOHDE]: interpret(EntitySelectionMachine, {
    devTools: isDev,
  }).start(),
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
    removeSelection: useCallback(
      () => send({ type: 'RESET_SELECTION' }),
      [send]
    ),
  };
};

export const useEntitySelection = entityType =>
  useEntitySelectionApi(SERVICE_BY_ENTITY[entityType]);
