import { useCallback } from 'react';

import { useSelector } from '@xstate/react';
import { createActor, type ActorRefFrom } from 'xstate';

import { ENTITY } from '#/src/constants';
import { inspect } from '#/src/utils/xstateInspector';

import { entitySelectionMachine } from './entitySelectionMachine';

const startEntitySelectionService = () =>
  createActor(
    entitySelectionMachine,
    inspect ? { inspect } : undefined
  ).start();

export const SERVICE_BY_ENTITY = {
  [ENTITY.TOTEUTUS]: startEntitySelectionService(),
  [ENTITY.HAKUKOHDE]: startEntitySelectionService(),
};

type EntitySelectionActor = ActorRefFrom<typeof entitySelectionMachine>;

export const useEntitySelectionApi = (actor: EntitySelectionActor) => {
  const selection = useSelector(actor, state => state.context.selection);

  return {
    selection,
    selectItems: useCallback(
      items => actor.send({ type: 'SELECT_ITEMS', items }),
      [actor]
    ),
    deselectItems: useCallback(
      items => actor.send({ type: 'DESELECT_ITEMS', items }),
      [actor]
    ),
    removeSelection: useCallback(
      () => actor.send({ type: 'RESET_SELECTION' }),
      [actor]
    ),
  };
};

export const useEntitySelection = entityType =>
  useEntitySelectionApi(SERVICE_BY_ENTITY[entityType]);
