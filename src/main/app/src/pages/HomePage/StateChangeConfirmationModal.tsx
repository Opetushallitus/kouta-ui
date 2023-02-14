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

export const StateChangeConfirmationWrapper = ({ children, mutation }) => {
  const batchOpsService = useInterpret(BatchOpsMachine, {
    services: {
      runMutation: (ctx, e) => mutation.mutateAsync(e),
    },
    devTools: isDev,
  });

  const [state] = useActor(batchOpsService);
  const { t } = useTranslation();

  return (
    <BatchOpsStateChangeContext.Provider value={batchOpsService}>
      {state.value === 'executing' ? (
        <OverlaySpin text={t('etusivu.hakukohde.tilaaVaihdetaan')} />
      ) : (
        children
      )}
    </BatchOpsStateChangeContext.Provider>
  );
};

export const StateChangeConfirmationModal = ({
  headerText,
  createColumns,
}: {
  headerText: string;
  createColumns: (
    selectionActor?: ActorRefFrom<typeof entitySelectionMachine>
  ) => any;
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
      header={headerText}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button variant="outlined" onClick={cancel}>
              {t('yleiset.sulje')}
            </Button>
          </Box>
          <Button disabled={_.isEmpty(selection)} onClick={onConfirm}>
            {t('etusivu.hakukohde.vahvistaTilanmuutos', {
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
