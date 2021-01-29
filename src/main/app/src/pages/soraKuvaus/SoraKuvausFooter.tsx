import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { queryCache } from 'react-query';

import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import updateSoraKuvaus from '#/src/utils/soraKuvaus/updateSoraKuvaus';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateSoraKuvausForm from '#/src/utils/soraKuvaus/validateSoraKuvausForm';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import createSoraKuvaus from '#/src/utils/soraKuvaus/createSoraKuvaus';

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
        queryCache.invalidateQueries(ENTITY.SORA_KUVAUS);
      }
    },
    [formMode, soraKuvaus, history]
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
