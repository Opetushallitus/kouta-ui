import React, { useCallback } from 'react';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';

import { getHakuByFormValues } from '#/src/utils/haku/getHakuByFormValues';
import updateHaku from '#/src/utils/haku/updateHaku';
import validateHakuForm from '#/src/utils/haku/validateHakuForm';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import createHaku from '#/src/utils/haku/createHaku';

type HakuModel = any;

type HakuFooterProps = {
  formMode: FormMode;
  haku: HakuModel;
  canUpdate?: boolean;
};

export const HakuFooter = ({ formMode, haku, canUpdate }: HakuFooterProps) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn = formMode === FormMode.CREATE ? createHaku : updateHaku;

      const { oid } = await dataSendFn({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(values),
        },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${haku.organisaatioOid}/haku/${oid}/muokkaus`
        );
      } else {
        queryCache.invalidateQueries(ENTITY.HAKU);
      }
    },
    [formMode, haku, history]
  );

  const { save } = useSaveForm({
    form: 'hakuForm',
    submit,
    validate: validateHakuForm,
  });

  return <FormFooter entity={ENTITY.HAKU} save={save} canUpdate={canUpdate} />;
};

export default HakuFooter;
