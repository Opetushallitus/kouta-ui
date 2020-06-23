import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import updateHakukohde from '../../utils/kouta/updateHakukohde';
import { ENTITY } from '#/src/constants';
import { FormFooter } from '#/src/components/FormPage';
import { useFormName } from '#/src/hooks/form';

const EditHakukohdeFooter = ({ hakukohde, haku, toteutus, canUpdate }) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHakukohde({
        httpClient,
        apiUrls,
        hakukohde: {
          ...hakukohde,
          ...getHakukohdeByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakukohdeUpdatedAt: Date.now(),
        },
      });
    },
    [hakukohde, history]
  );

  const formName = useFormName();

  const save = useSaveHakukohde({ submit, haku, toteutus, formName });

  return (
    <FormFooter entity={ENTITY.HAKUKOHDE} save={save} canUpdate={canUpdate} />
  );
};

export default EditHakukohdeFooter;
