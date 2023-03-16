import React, { useCallback, useMemo } from 'react';

import { useActor, useInterpret } from '@xstate/react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { ActorRefFrom, InterpreterFrom } from 'xstate';

import Modal from '#/src/components/Modal';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { Box, Button } from '#/src/components/virkailija';
import { safeGetJulkaisutilaTranslationKey } from '#/src/constants';
import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import { BatchOpsMachine } from '#/src/machines/batchOpsMachine';
import { isDev } from '#/src/utils';

import { useBatchOpsApi } from './CopyConfirmationModal';
import { EntityListTable } from './EntitySearchList';
import { entitySelectionMachine } from './entitySelectionMachine';
import { CopyHakukohteetMutationFunctionAsync } from './HakukohteetSection/changeHakukohteetState';
import { useEntitySelectionApi } from './useEntitySelection';

export const BatchOpsStateChangeContext = React.createContext<
  InterpreterFrom<typeof BatchOpsMachine>
>({} as any);

export const useStateChangeBatchOpsApi = () => {
  const batchOpsService = useContextOrThrow(BatchOpsStateChangeContext);
  return useBatchOpsApi(
    batchOpsService as InterpreterFrom<typeof BatchOpsMachine>
  );
};

export const StateChangeConfirmationWrapper = ({
  children,
  mutateAsync,
  entityTranslationKeyPath,
}: {
  children: React.ReactNode;
  mutateAsync: CopyHakukohteetMutationFunctionAsync;
  entityTranslationKeyPath: string;
}) => {
  const batchOpsService = useInterpret(BatchOpsMachine, {
    services: {
      runMutation: (ctx, e) => mutateAsync(e),
    },
    devTools: isDev,
  });

  const [state] = useActor(batchOpsService);
  const { t } = useTranslation();

  return (
    <BatchOpsStateChangeContext.Provider value={batchOpsService}>
      {state.value === 'executing' ? (
        <OverlaySpin text={t(`${entityTranslationKeyPath}.tilaaVaihdetaan`)} />
      ) : (
        children
      )}
    </BatchOpsStateChangeContext.Provider>
  );
};

export const StateChangeConfirmationModal = ({
  createColumns,
  entityTranslationKeyPath,
}: {
  createColumns: (
    selectionActor?: ActorRefFrom<typeof entitySelectionMachine>
  ) => any;
  entityTranslationKeyPath: string;
}) => {
  const { t } = useTranslation();

  const { state, cancel, tila, entities, execute, selectionRef } =
    useStateChangeBatchOpsApi();

  const columns = useMemo(
    () => createColumns(selectionRef),
    [createColumns, selectionRef]
  );

  const { selection } = useEntitySelectionApi(selectionRef);

  const onConfirm = useCallback(() => {
    execute({ entities: selection, tila });
  }, [execute, selection, tila]);

  return (
    <Modal
      minHeight="200px"
      maxWidth="1200px"
      open={state === 'confirming'}
      onClose={cancel}
      header={t(`${entityTranslationKeyPath}.vahvistaTilanmuutosOtsikko`)}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="outlined" onClick={cancel}>
              {t('yleiset.sulje')}
            </Button>
          </Box>
          <Button disabled={_.isEmpty(selection)} onClick={onConfirm}>
            {t(`${entityTranslationKeyPath}.vahvistaTilanmuutos`, {
              tila: t(safeGetJulkaisutilaTranslationKey(tila)),
            })}
          </Button>
        </Box>
      }
    >
      <EntityListTable entities={entities} columns={columns} />
    </Modal>
  );
};
