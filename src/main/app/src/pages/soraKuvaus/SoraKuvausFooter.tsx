import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { SoraKuvausModel } from '#/src/types/domainTypes';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createSoraKuvaus } from '#/src/utils/soraKuvaus/createSoraKuvaus';
import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import { updateSoraKuvaus } from '#/src/utils/soraKuvaus/updateSoraKuvaus';
import validateSoraKuvausForm from '#/src/utils/soraKuvaus/validateSoraKuvausForm';

type SoraKuvausFooterProps = {
  organisaatioOid: string;
  formMode: FormMode;
  soraKuvaus?: SoraKuvausModel;
  canUpdate?: boolean;
};

export const SoraKuvausFooter = ({
  organisaatioOid,
  formMode,
  soraKuvaus = {},
  canUpdate,
}: SoraKuvausFooterProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE ? createSoraKuvaus : updateSoraKuvaus;

      const { id } = await dataSendFn({
        httpClient,
        apiUrls,
        soraKuvaus:
          formMode === FormMode.CREATE
            ? {
                ...getSoraKuvausByFormValues(values),
              }
            : {
                ...soraKuvaus,
                ...getSoraKuvausByFormValues(values),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/sora-kuvaus/${id}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.SORA_KUVAUS, values.tila);
      }
    },
    [formMode, soraKuvaus, navigate, queryClient, organisaatioOid]
  );

  const save = useSaveForm({
    formName: ENTITY.SORA_KUVAUS,
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <FormFooter
      entityType={ENTITY.SORA_KUVAUS}
      entity={soraKuvaus}
      hideEsikatselu
      save={save}
      canUpdate={canUpdate}
    />
  );
};
