import React, { useCallback, useMemo } from 'react';

import { useActor, useInterpret, useSelector } from '@xstate/react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Modal from '#/src/components/Modal';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { Box, Button } from '#/src/components/virkailija';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { BatchOpsMachine } from '#/src/machines/batchOpsMachine';
import { isDev } from '#/src/utils';

import { EntityListTable } from './EntitySearchList';
import { useEntitySelectionApi } from './useEntitySelection';

export const BatchOpsCopyContext = React.createContext({} as any);

export const useBatchOpsApi = batchOpsService => {
  const [state, send] = useActor(batchOpsService);

  const tila = useSelector(batchOpsService, s => s.context?.tila);
  const entities = useSelector(batchOpsService, s => s.context?.entities);
  const result = useSelector(batchOpsService, s => s.context?.result);
  const error = useSelector(batchOpsService, s => s.context?.error);

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
      start: ({ tila, entities }: any) =>
        send({ type: 'START', tila, entities }),
      cancel: () => send({ type: 'CANCEL' }),
      execute: ({ entities, tila }) =>
        send({ type: 'EXECUTE', entities, tila }),
      close: () => send({ type: 'CLOSE' }),
      result,
      error,
      isSuccess: state.matches('result.success'),
      isError: state.matches('result.error'),
    }),
    [state, send, tila, entities, batchOpsService, result, error, selectionRef]
  );
};

export const useCopyBatchOpsApi = () => {
  const batchOpsService = useContextOrThrow(BatchOpsCopyContext);
  return useBatchOpsApi(batchOpsService);
};

export const CopyConfirmationWrapper = ({ children, mutation }) => {
  const batchOpsService = useInterpret(BatchOpsMachine, {
    context: {
      mutation,
    },
    devTools: isDev,
  });

  const [state] = useActor(batchOpsService);

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
  createColumns: (selectionActor: any) => any;
}) => {
  const { t } = useTranslation();

  const { state, cancel, execute, entities, selectionRef } =
    useCopyBatchOpsApi();

  const columns = useMemo(
    () => createColumns(selectionRef),
    [createColumns, selectionRef]
  );

  const { selection } = useEntitySelectionApi(selectionRef);

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
          <Button disabled={_.isEmpty(selection)} onClick={onConfirm}>
            {t('etusivu.aloitaKopiointi')}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
