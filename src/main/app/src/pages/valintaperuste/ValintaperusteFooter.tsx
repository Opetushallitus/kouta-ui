import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { queryCache } from 'react-query';

import updateValintaperuste from '#/src/utils/valintaperuste/updateValintaperuste';
import { getValintaperusteByFormValues } from '#/src/utils/valintaperuste/getValintaperusteByFormValues';
import { ENTITY, FormMode } from '#/src/constants';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { useFormName } from '#/src/hooks/form';
import createValintaperuste from '#/src/utils/valintaperuste/createValintaperuste';

type ValintaperusteFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  valintaperuste?: any;
  canUpdate?: boolean;
};

export const ValintaperusteFooter = ({
  formMode,
  organisaatioOid,
  valintaperuste = {},
  canUpdate,
}: ValintaperusteFooterProps) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE
          ? createValintaperuste
          : updateValintaperuste;

      const { id } = await dataSendFn({
        httpClient,
        apiUrls,
        valintaperuste: {
          organisaatioOid,
          ...valintaperuste,
          ...getValintaperusteByFormValues(values),
        },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`
        );
      } else {
        queryCache.invalidateQueries(ENTITY.VALINTAPERUSTE);
      }
    },
    [formMode, organisaatioOid, valintaperuste, history]
  );

  const formName = useFormName();
  const save = useSaveValintaperuste({ submit, formName });

  return (
    <FormFooter
      entity={ENTITY.VALINTAPERUSTE}
      save={save}
      canUpdate={canUpdate}
    />
  );
};
