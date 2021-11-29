import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import { postUpdate } from '#/src/utils/postUpdate';
import createSoraKuvaus from '#/src/utils/soraKuvaus/createSoraKuvaus';
import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import updateSoraKuvaus from '#/src/utils/soraKuvaus/updateSoraKuvaus';
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
  const history = useHistory();

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
                organisaatioOid,
              }
            : {
                ...soraKuvaus,
                ...getSoraKuvausByFormValues(values),
              },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${organisaatioOid}/sora-kuvaus/${id}/muokkaus`
        );
      } else {
        postUpdate(queryClient, history, ENTITY.SORA_KUVAUS, values.tila);
      }
    },
    [formMode, soraKuvaus, history, queryClient, organisaatioOid]
  );

  const save = useSaveForm({
    formName: 'soraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  const name = useFieldValue('nimi');

  return (
    <FormFooter
      entityType={ENTITY.SORA_KUVAUS}
      entity={soraKuvaus}
      entityName={name}
      hideEsikatselu
      save={save}
      canUpdate={canUpdate}
    />
  );
};
