import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createSoraKuvaus from '#/src/utils/soraKuvaus/createSoraKuvaus';
import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import updateSoraKuvaus from '#/src/utils/soraKuvaus/updateSoraKuvaus';
import validateSoraKuvausForm from '#/src/utils/soraKuvaus/validateSoraKuvausForm';

type SoraKuvausFooterProps = {
  formMode: FormMode;
  soraKuvaus: SoraKuvausModel;
  canUpdate?: boolean;
};

export const SoraKuvausFooter = ({
  formMode,
  soraKuvaus,
  canUpdate,
}: SoraKuvausFooterProps) => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE ? createSoraKuvaus : updateSoraKuvaus;

      const { id } = await dataSendFn({
        httpClient,
        apiUrls,
        soraKuvaus: {
          ...soraKuvaus,
          ...getSoraKuvausByFormValues(values),
        },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${soraKuvaus.organisaatioOid}/sora-kuvaus/${id}/muokkaus`
        );
      } else {
        queryClient.invalidateQueries(ENTITY.SORA_KUVAUS);
      }
    },
    [formMode, soraKuvaus, history, queryClient]
  );

  const { save } = useSaveForm({
    form: 'soraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <FormFooter entity={ENTITY.SORA_KUVAUS} save={save} canUpdate={canUpdate} />
  );
};
