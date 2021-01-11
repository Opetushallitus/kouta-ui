import React, { useCallback } from 'react';
import { queryCache } from 'react-query';

import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import { getHakukohdeByFormValues } from '#/src/utils/hakukohde/getHakukohdeByFormValues';
import updateHakukohde from '#/src/utils/hakukohde/updateHakukohde';
import { ENTITY } from '#/src/constants';
import { FormFooter } from '#/src/components/FormPage';
import { useFormName } from '#/src/hooks/form';

const EditHakukohdeFooter = ({ hakukohde, haku, toteutus, canUpdate }) => {
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

      queryCache.invalidateQueries('hakukohde');
    },
    [hakukohde]
  );

  const formName = useFormName();

  const save = useSaveHakukohde({ submit, haku, toteutus, formName });

  return (
    <FormFooter entity={ENTITY.HAKUKOHDE} save={save} canUpdate={canUpdate} />
  );
};

export default EditHakukohdeFooter;
