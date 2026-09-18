import React, { useCallback, useMemo } from 'react';

import { useActorRef, useSelector } from '@xstate/react';
import { isEmpty } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { ActorRefFrom, fromPromise } from 'xstate';

import Modal from '#/src/components/Modal';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import {
  BatchOpsMachine,
  ExecuteEvent,
  StartEvent,
} from '#/src/machines/batchOpsMachine';

import { EntityListTable } from './EntitySearchList';
import { entitySelectionMachine } from './entitySelectionMachine';
import { CopyToteutuksetMutationFunctionAsync } from './ToteutuksetSection/copyToteutukset';
import { useEntitySelectionApi } from './useEntitySelection';

export const BatchOpsCopyContext = React.createContext<
  ActorRefFrom<typeof BatchOpsMachine> | undefined
>(undefined);

export const useBatchOpsApi = (
  batchOpsService: ActorRefFrom<typeof BatchOpsMachine>
) => {
  const state = useSelector(batchOpsService, s => s);

  const tila = useSelector(batchOpsService, s => s.context?.tila);
  const entities = useSelector(batchOpsService, s => s.context?.entities);
  const result = useSelector(batchOpsService, s => s.context?.result);

  const selectionRef = useSelector(
    batchOpsService,
    s => s.context?.selectionRef
  );

  return useMemo(
    () => ({
      service: batchOpsService,
      selectionRef,
      tila,
      entities,
      state: state.value,
      start: ({ tila, entities }: Omit<StartEvent, 'type'>) =>
        batchOpsService.send({ type: 'START', tila, entities }),
      cancel: () => batchOpsService.send({ type: 'CANCEL' }),
      execute: ({ entities, tila }: Omit<ExecuteEvent, 'type'>) =>
        batchOpsService.send({ type: 'EXECUTE', entities, tila }),
      close: () => batchOpsService.send({ type: 'CLOSE' }),
      result,
      isSuccess: state.matches({ result: 'success' }),
      isError: state.matches({ result: 'error' }),
    }),
    [state, batchOpsService, tila, entities, result, selectionRef]
  );
};

export const useCopyBatchOpsApi = () => {
  const batchOpsService = useContextOrThrow(BatchOpsCopyContext);
  return useBatchOpsApi(batchOpsService);
};

export const CopyConfirmationWrapper = ({
  children,
  mutateAsync,
}: {
  children: React.ReactNode;
  mutateAsync: CopyToteutuksetMutationFunctionAsync;
}) => {
  const batchOpsService = useActorRef(
    BatchOpsMachine.provide({
      actors: {
        runMutation: fromPromise(({ input }) => mutateAsync(input)),
      },
    })
  );

  const state = useSelector(batchOpsService, s => s);

  const { t } = useTranslation();

  return (
    <BatchOpsCopyContext.Provider value={batchOpsService}>
      {state.value === 'executing' ? (
        <OverlaySpin text={t('etusivu.toteutus.kopioidaan')} />
      ) : (
        children
      )}
    </BatchOpsCopyContext.Provider>
  );
};

export const CopyConfirmationModal = ({
  headerText,
  createColumns,
}: {
  headerText: string;
  createColumns: (
    selectionActor?: ActorRefFrom<typeof entitySelectionMachine>
  ) => any;
}) => {
  const { t } = useTranslation();

  const { state, cancel, execute, entities, selectionRef } =
    useCopyBatchOpsApi();

  const columns = useMemo(
    () => createColumns(selectionRef),
    [createColumns, selectionRef]
  );

  const { selection } = useEntitySelectionApi(selectionRef!);

  const onConfirm = useCallback(() => {
    execute({ entities: selection });
  }, [execute, selection]);

  return (
    <Modal
      minHeight="200px"
      maxWidth="1200px"
      open={state === 'confirming'}
      onClose={cancel}
      header={headerText}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="outlined" onClick={cancel}>
              {t('yleiset.sulje')}
            </Button>
          </Box>
          <Button disabled={isEmpty(selection)} onClick={onConfirm}>
            {t('etusivu.aloitaKopiointi')}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
